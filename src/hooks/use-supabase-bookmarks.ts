import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseBookmark {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
  translation: string;
  note?: string;
  is_favorite: boolean;
  highlight_color?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseBookmarks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<SupabaseBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from Supabase
  const loadBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBookmarks(data || []);
    } catch (error: any) {
      console.error('Error loading bookmarks:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading bookmarks',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  // Add bookmark
  const addBookmark = async (bookmark: {
    book: string;
    chapter: number;
    verse_number: number;
    verse_text: string;
    translation?: string;
    note?: string;
    highlight_color?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: user.id,
          ...bookmark,
          translation: bookmark.translation || 'NIV',
          is_favorite: false
        }])
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => [data, ...prev]);
      toast({
        title: 'Verse bookmarked',
        description: `${bookmark.book} ${bookmark.chapter}:${bookmark.verse_number} saved`
      });

      return data;
    } catch (error: any) {
      console.error('Error adding bookmark:', error);
      toast({
        variant: 'destructive',
        title: 'Error adding bookmark',
        description: error.message
      });
      return null;
    }
  };

  // Remove bookmark
  const removeBookmark = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast({
        title: 'Bookmark removed',
        description: 'Verse has been removed from your bookmarks'
      });
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
      toast({
        variant: 'destructive',
        title: 'Error removing bookmark',
        description: error.message
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    if (!user) return;

    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update({ is_favorite: !bookmark.is_favorite })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => prev.map(b => b.id === id ? data : b));
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating favorite',
        description: error.message
      });
    }
  };

  // Update note
  const updateNote = async (id: string, note: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update({ note })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => prev.map(b => b.id === id ? data : b));
      toast({
        title: 'Note updated',
        description: 'Your note has been saved'
      });
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating note',
        description: error.message
      });
    }
  };

  // Check if verse is bookmarked
  const isBookmarked = (book: string, chapter: number, verse: number): boolean => {
    return bookmarks.some(b => 
      b.book === book && 
      b.chapter === chapter && 
      b.verse_number === verse
    );
  };

  // Get favorites
  const getFavorites = (): SupabaseBookmark[] => {
    return bookmarks.filter(b => b.is_favorite);
  };

  // Get bookmarks by book
  const getBookmarksByBook = (book: string): SupabaseBookmark[] => {
    return bookmarks.filter(b => b.book === book);
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleFavorite,
    updateNote,
    isBookmarked,
    getFavorites,
    getBookmarksByBook,
    refetch: loadBookmarks
  };
};