import { useState, useEffect } from 'react';
import { useSupabasePreferences } from '@/hooks/use-supabase-preferences';
import { useAuth } from '@/contexts/AuthContext';
import StorageService, { UserPreferences } from '@/services/StorageService';

export const usePreferences = () => {
  const { user } = useAuth();
  const { preferences: supabasePreferences, updatePreferences: updateSupabasePreferences } = useSupabasePreferences();
  
  // Use Supabase preferences if user is logged in, otherwise use local storage
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(
    StorageService.getPreferences()
  );
  
  const preferences = user && supabasePreferences ? {
    theme: supabasePreferences.theme as 'light' | 'dark' | 'system',
    fontSize: supabasePreferences.font_size as 'small' | 'medium' | 'large' | 'xl',
    fontFamily: 'inter' as 'inter' | 'playfair' | 'system', // Default since not in Supabase yet
    autoScroll: false, // Default since not in Supabase yet
    dailyReminders: supabasePreferences.daily_reminders,
    reminderTime: supabasePreferences.reminder_time,
    preferredTranslation: supabasePreferences.preferred_translation
  } : localPreferences;

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    if (user && supabasePreferences) {
      // Update Supabase preferences
      const supabaseUpdates: any = {};
      if (updates.theme) supabaseUpdates.theme = updates.theme;
      if (updates.fontSize) supabaseUpdates.font_size = updates.fontSize;
      if (updates.dailyReminders !== undefined) supabaseUpdates.daily_reminders = updates.dailyReminders;
      if (updates.reminderTime) supabaseUpdates.reminder_time = updates.reminderTime;
      if (updates.preferredTranslation) supabaseUpdates.preferred_translation = updates.preferredTranslation;
      
      updateSupabasePreferences(supabaseUpdates);
    } else {
      // Update local preferences
      const newPreferences = { ...localPreferences, ...updates };
      setLocalPreferences(newPreferences);
      StorageService.updatePreferences(updates);
    }
  };

  const resetPreferences = () => {
    if (user) {
      // Reset Supabase preferences to defaults
      updateSupabasePreferences({
        theme: 'system',
        font_size: 'medium',
        daily_reminders: true,
        reminder_time: '08:00',
        preferred_translation: 'kjv'
      });
    } else {
      // Reset local preferences
      StorageService.clearAllData();
      const defaultPrefs = StorageService.getPreferences();
      setLocalPreferences(defaultPrefs);
      StorageService.applyTheme(defaultPrefs.theme);
    }
  };

  // Apply theme on mount and when preferences change
  useEffect(() => {
    if (user && supabasePreferences) {
      StorageService.applyTheme(supabasePreferences.theme as 'light' | 'dark' | 'system');
    } else {
      StorageService.applyTheme(localPreferences.theme);
    }
  }, [preferences.theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => StorageService.applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};