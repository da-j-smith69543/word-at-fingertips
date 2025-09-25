import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SupabasePreferences {
  id: string;
  user_id: string;
  preferred_translation: string;
  theme: string;
  font_size: string;
  daily_reminders: boolean;
  reminder_time: string;
}

export const useSupabasePreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<SupabasePreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load preferences from Supabase
  const loadPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, preferred_translation, theme, font_size, daily_reminders, reminder_time')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      setPreferences(data);
    } catch (error: any) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user]);

  // Update preferences
  const updatePreferences = async (updates: Partial<SupabasePreferences>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select('id, user_id, preferred_translation, theme, font_size, daily_reminders, reminder_time')
        .single();

      if (error) throw error;

      setPreferences(data);
      
      // Apply theme changes immediately if theme was updated
      if (updates.theme) {
        applyTheme(updates.theme);
      }
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving preferences',
        description: error.message
      });
    }
  };

  // Apply theme to document
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else { // system
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Apply theme on preferences change
  useEffect(() => {
    if (preferences?.theme) {
      applyTheme(preferences.theme);
    }
  }, [preferences?.theme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (preferences?.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences?.theme]);

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: loadPreferences
  };
};