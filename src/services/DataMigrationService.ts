import StorageService, { BookmarkedVerse, UserPreferences } from './StorageService';
import { supabase } from '@/integrations/supabase/client';

export class DataMigrationService {
  // Check if user has local data that needs migration
  static hasLocalData(): boolean {
    const bookmarks = StorageService.getBookmarks();
    return bookmarks.length > 0;
  }

  // Migrate local bookmarks to Supabase
  static async migrateBookmarks(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const localBookmarks = StorageService.getBookmarks();
      
      if (localBookmarks.length === 0) {
        return { success: true };
      }

      // Convert local bookmarks to Supabase format
      const supabaseBookmarks = localBookmarks.map(bookmark => ({
        user_id: userId,
        book: bookmark.book,
        chapter: bookmark.chapter,
        verse_number: bookmark.verse,
        verse_text: bookmark.text,
        translation: 'NIV', // Default to NIV for migrated bookmarks
        note: bookmark.note || null,
        is_favorite: bookmark.isFavorite || false,
        highlight_color: null,
        created_at: bookmark.dateAdded || new Date().toISOString()
      }));

      // Insert bookmarks in batches of 100
      const batchSize = 100;
      for (let i = 0; i < supabaseBookmarks.length; i += batchSize) {
        const batch = supabaseBookmarks.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('bookmarks')
          .insert(batch);
          
        if (error) throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error migrating bookmarks:', error);
      return { success: false, error: error.message };
    }
  }

  // Migrate local preferences to Supabase profile
  static async migratePreferences(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const localPreferences = StorageService.getPreferences();

      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_translation: localPreferences.preferredTranslation,
          theme: localPreferences.theme,
          font_size: localPreferences.fontSize,
          daily_reminders: localPreferences.dailyReminders,
          reminder_time: localPreferences.reminderTime
        })
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error migrating preferences:', error);
      return { success: false, error: error.message };
    }
  }

  // Migrate reading history to Supabase
  static async migrateReadingHistory(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const readingHistory = StorageService.getReadingHistory();
      
      if (readingHistory.length === 0) {
        return { success: true };
      }

      // Convert local reading history to Supabase format
      const supabaseHistory = readingHistory.map(entry => ({
        user_id: userId,
        book: entry.book,
        chapter: entry.chapter,
        progress: entry.progress || 0,
        last_read_at: entry.lastRead || new Date().toISOString()
      }));

      // Insert reading history with upsert to handle duplicates
      const { error } = await supabase
        .from('reading_history')
        .upsert(supabaseHistory, {
          onConflict: 'user_id,book,chapter'
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error migrating reading history:', error);
      return { success: false, error: error.message };
    }
  }

  // Full migration process
  static async migrateAllData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Migrate bookmarks
      const bookmarksResult = await this.migrateBookmarks(userId);
      if (!bookmarksResult.success) {
        return bookmarksResult;
      }

      // Migrate preferences
      const preferencesResult = await this.migratePreferences(userId);
      if (!preferencesResult.success) {
        return preferencesResult;
      }

      // Migrate reading history
      const historyResult = await this.migrateReadingHistory(userId);
      if (!historyResult.success) {
        return historyResult;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error during full migration:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear local data after successful migration
  static clearLocalData(): void {
    StorageService.clearAllData();
  }

  // Check if migration is needed and prompt user
  static async promptMigration(userId: string): Promise<boolean> {
    const hasLocal = this.hasLocalData();
    
    if (!hasLocal) return false;

    return new Promise((resolve) => {
      const shouldMigrate = window.confirm(
        'We found existing bookmarks and preferences on this device. Would you like to sync them to your account?'
      );
      resolve(shouldMigrate);
    });
  }
}