import { useState, useEffect } from 'react';
import StorageService, { BookmarkedVerse } from '@/services/StorageService';
import { useToast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  const { toast } = useToast();

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(StorageService.getBookmarks());
  }, []);

  const addBookmark = (verse: Omit<BookmarkedVerse, 'id' | 'dateAdded'>) => {
    try {
      const newBookmark = StorageService.addBookmark(verse);
      setBookmarks(StorageService.getBookmarks());
      
      toast({
        title: "Verse Bookmarked",
        description: `${verse.book} ${verse.chapter}:${verse.verse}`,
        duration: 2000,
      });
      
      return newBookmark;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bookmark verse",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    }
  };

  const removeBookmark = (id: string) => {
    try {
      StorageService.removeBookmark(id);
      setBookmarks(StorageService.getBookmarks());
      
      toast({
        title: "Bookmark Removed",
        description: "Verse removed from bookmarks",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const toggleFavorite = (id: string) => {
    try {
      StorageService.toggleFavorite(id);
      setBookmarks(StorageService.getBookmarks());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const updateNote = (id: string, note: string) => {
    try {
      StorageService.updateBookmarkNote(id, note);
      setBookmarks(StorageService.getBookmarks());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isBookmarked = (book: string, chapter: number, verse: number): boolean => {
    return StorageService.isBookmarked(book, chapter, verse);
  };

  const getFavorites = (): BookmarkedVerse[] => {
    return bookmarks.filter(bookmark => bookmark.isFavorite);
  };

  const getBookmarksByBook = (book: string): BookmarkedVerse[] => {
    return bookmarks.filter(bookmark => bookmark.book === book);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleFavorite,
    updateNote,
    isBookmarked,
    getFavorites,
    getBookmarksByBook
  };
};