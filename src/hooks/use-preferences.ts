import { useState, useEffect } from 'react';
import StorageService, { UserPreferences } from '@/services/StorageService';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    StorageService.getPreferences()
  );

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    StorageService.updatePreferences(updates);
  };

  const resetPreferences = () => {
    StorageService.clearAllData();
    const defaultPrefs = StorageService.getPreferences();
    setPreferences(defaultPrefs);
    StorageService.applyTheme(defaultPrefs.theme);
  };

  // Apply theme on mount and when preferences change
  useEffect(() => {
    StorageService.applyTheme(preferences.theme);
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