export interface BookmarkedVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  dateAdded: string;
  isFavorite?: boolean;
  tags?: string[];
  note?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  fontFamily: 'inter' | 'playfair' | 'system';
  autoScroll: boolean;
  dailyReminders: boolean;
  reminderTime: string;
  preferredTranslation: string;
}

export interface ReadingHistory {
  book: string;
  chapter: number;
  lastRead: string;
  progress: number; // percentage read
}

class StorageService {
  private static readonly BOOKMARKS_KEY = 'empirial_bible_bookmarks';
  private static readonly PREFERENCES_KEY = 'empirial_bible_preferences';
  private static readonly READING_HISTORY_KEY = 'empirial_bible_reading_history';
  private static readonly OFFLINE_CHAPTERS_KEY = 'empirial_bible_offline_chapters';

  // Default preferences
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'inter',
    autoScroll: false,
    dailyReminders: true,
    reminderTime: '08:00',
    preferredTranslation: 'kjv'
  };

  // Bookmarks Management
  static getBookmarks(): BookmarkedVerse[] {
    try {
      const bookmarks = localStorage.getItem(this.BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  static addBookmark(verse: Omit<BookmarkedVerse, 'id' | 'dateAdded'>): BookmarkedVerse {
    const bookmarks = this.getBookmarks();
    const newBookmark: BookmarkedVerse = {
      ...verse,
      id: `${verse.book}-${verse.chapter}-${verse.verse}-${Date.now()}`,
      dateAdded: new Date().toISOString()
    };
    
    // Check if already bookmarked
    const existingIndex = bookmarks.findIndex(
      b => b.book === verse.book && b.chapter === verse.chapter && b.verse === verse.verse
    );
    
    if (existingIndex >= 0) {
      bookmarks[existingIndex] = newBookmark;
    } else {
      bookmarks.unshift(newBookmark);
    }
    
    this.saveBookmarks(bookmarks);
    return newBookmark;
  }

  static removeBookmark(id: string): void {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);
    this.saveBookmarks(filtered);
  }

  static toggleFavorite(id: string): void {
    const bookmarks = this.getBookmarks();
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      bookmark.isFavorite = !bookmark.isFavorite;
      this.saveBookmarks(bookmarks);
    }
  }

  static updateBookmarkNote(id: string, note: string): void {
    const bookmarks = this.getBookmarks();
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      bookmark.note = note;
      this.saveBookmarks(bookmarks);
    }
  }

  static isBookmarked(book: string, chapter: number, verse: number): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.book === book && b.chapter === chapter && b.verse === verse);
  }

  private static saveBookmarks(bookmarks: BookmarkedVerse[]): void {
    try {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }

  // User Preferences
  static getPreferences(): UserPreferences {
    try {
      const preferences = localStorage.getItem(this.PREFERENCES_KEY);
      return preferences ? { ...this.DEFAULT_PREFERENCES, ...JSON.parse(preferences) } : this.DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return this.DEFAULT_PREFERENCES;
    }
  }

  static updatePreferences(updates: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...updates };
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updated));
      
      // Apply theme immediately
      if (updates.theme) {
        this.applyTheme(updates.theme);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  static applyTheme(theme: UserPreferences['theme']): void {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  // Reading History
  static getReadingHistory(): ReadingHistory[] {
    try {
      const history = localStorage.getItem(this.READING_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading reading history:', error);
      return [];
    }
  }

  static updateReadingHistory(book: string, chapter: number, progress: number = 100): void {
    try {
      const history = this.getReadingHistory();
      const existingIndex = history.findIndex(h => h.book === book && h.chapter === chapter);
      
      const historyItem: ReadingHistory = {
        book,
        chapter,
        lastRead: new Date().toISOString(),
        progress
      };
      
      if (existingIndex >= 0) {
        history[existingIndex] = historyItem;
      } else {
        history.unshift(historyItem);
      }
      
      // Keep only last 50 items
      const trimmed = history.slice(0, 50);
      localStorage.setItem(this.READING_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving reading history:', error);
    }
  }

  static getRecentBooks(): ReadingHistory[] {
    return this.getReadingHistory().slice(0, 10);
  }

  // Offline Chapters
  static saveOfflineChapter(book: string, chapter: number, data: any): void {
    try {
      const key = `${book}-${chapter}`;
      const offlineData = this.getOfflineChapters();
      offlineData[key] = {
        ...data,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.OFFLINE_CHAPTERS_KEY, JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error saving offline chapter:', error);
    }
  }

  static getOfflineChapter(book: string, chapter: number): any | null {
    try {
      const key = `${book}-${chapter}`;
      const offlineData = this.getOfflineChapters();
      return offlineData[key] || null;
    } catch (error) {
      console.error('Error loading offline chapter:', error);
      return null;
    }
  }

  private static getOfflineChapters(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.OFFLINE_CHAPTERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading offline chapters:', error);
      return {};
    }
  }

  // Utility methods
  static clearAllData(): void {
    localStorage.removeItem(this.BOOKMARKS_KEY);
    localStorage.removeItem(this.PREFERENCES_KEY);
    localStorage.removeItem(this.READING_HISTORY_KEY);
    localStorage.removeItem(this.OFFLINE_CHAPTERS_KEY);
  }

  static exportData(): string {
    const data = {
      bookmarks: this.getBookmarks(),
      preferences: this.getPreferences(),
      readingHistory: this.getReadingHistory(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.bookmarks) {
        localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
      }
      if (data.preferences) {
        localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(data.preferences));
      }
      if (data.readingHistory) {
        localStorage.setItem(this.READING_HISTORY_KEY, JSON.stringify(data.readingHistory));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default StorageService;