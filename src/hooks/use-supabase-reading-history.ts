import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseReadingHistory {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  progress: number;
  last_read_at: string;
  created_at: string;
}

export const useSupabaseReadingHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [readingHistory, setReadingHistory] = useState<SupabaseReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reading history from Supabase
  const loadReadingHistory = async () => {
    if (!user) {
      setReadingHistory([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false });

      if (error) throw error;
      
      setReadingHistory(data || []);
    } catch (error: any) {
      console.error('Error loading reading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReadingHistory();
  }, [user]);

  // Update reading progress
  const updateReadingProgress = async (book: string, chapter: number, progress: number = 0) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reading_history')
        .upsert({
          user_id: user.id,
          book,
          chapter,
          progress,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,book,chapter'
        })
        .select()
        .single();

      if (error) throw error;

      setReadingHistory(prev => {
        const filtered = prev.filter(h => !(h.book === book && h.chapter === chapter));
        return [data, ...filtered];
      });
    } catch (error: any) {
      console.error('Error updating reading progress:', error);
    }
  };

  // Get recent books (last 10 unique books read)
  const getRecentBooks = (): SupabaseReadingHistory[] => {
    const uniqueBooks = new Map();
    
    for (const entry of readingHistory) {
      const key = `${entry.book}-${entry.chapter}`;
      if (!uniqueBooks.has(key)) {
        uniqueBooks.set(key, entry);
      }
    }
    
    return Array.from(uniqueBooks.values()).slice(0, 10);
  };

  return {
    readingHistory,
    loading,
    updateReadingProgress,
    getRecentBooks,
    refetch: loadReadingHistory
  };
};