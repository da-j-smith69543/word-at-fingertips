import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Book, ChevronLeft, ChevronRight, Bookmark, RefreshCw, Wifi, WifiOff, Download, Settings } from 'lucide-react';
import { bibleBooks, getChapter, type Verse } from '@/data/bible';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseBookmarks } from '@/hooks/use-supabase-bookmarks';
import { usePreferences } from '@/hooks/use-preferences';
import { LoadingState } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import StorageService from '@/services/StorageService';
import { BibleApiService, BIBLE_TRANSLATIONS } from '@/services/BibleApiService';
import { useAuth } from '@/contexts/AuthContext';

interface BibleReaderProps {
  selectedBook?: string;
  selectedChapter?: number;
}

export const BibleReader = ({ selectedBook = 'John', selectedChapter = 3 }: BibleReaderProps) => {
  const [currentBook, setCurrentBook] = useState(selectedBook);
  const [currentChapter, setCurrentChapter] = useState(selectedChapter);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { isBookmarked, addBookmark, removeBookmark } = useSupabaseBookmarks();
  const { preferences } = usePreferences();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load chapter content
  useEffect(() => {
    loadChapter();
    // Update reading history
    StorageService.updateReadingHistory(currentBook, currentChapter);
  }, [currentBook, currentChapter]);

  // Apply font preferences
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--reader-font-size', getFontSizeValue(preferences.fontSize));
    root.style.setProperty('--reader-font-family', getFontFamilyValue(preferences.fontFamily));
  }, [preferences.fontSize, preferences.fontFamily]);

  const getFontSizeValue = (size: string) => {
    const sizes = { small: '0.875rem', medium: '1rem', large: '1.125rem', xl: '1.25rem' };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  };

  const getFontFamilyValue = (family: string) => {
    const families = {
      inter: 'Inter, sans-serif',
      playfair: 'Playfair Display, serif',
      system: 'system-ui, sans-serif'
    };
    return families[family as keyof typeof families] || families.inter;
  };

  const loadChapter = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Set translation before loading
      BibleApiService.setTranslation(preferences.preferredTranslation);
      
      // Try to load from offline storage first
      const offlineChapter = StorageService.getOfflineChapter(currentBook, currentChapter);
      if (offlineChapter && !isOnline) {
        setVerses(offlineChapter.verses);
        return;
      }
      
      const chapterVerses = await getChapter(currentBook, currentChapter);
      setVerses(chapterVerses);
      
      // Save to offline storage if we got data
      if (chapterVerses.length > 0) {
        StorageService.saveOfflineChapter(currentBook, currentChapter, { verses: chapterVerses });
      }
      
      if (chapterVerses.length === 0) {
        toast({
          title: isOnline ? "Chapter Not Found" : "Chapter Not Available Offline",
          description: isOnline 
            ? `${currentBook} ${currentChapter} could not be loaded`
            : `${currentBook} ${currentChapter} is not available offline`,
          variant: isOnline ? "destructive" : "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      setError('Failed to load chapter. Please check your connection and try again.');
      toast({
        title: "Error",
        description: "Failed to load chapter. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadChapter = async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Connect to internet to download chapters",
        duration: 3000,
      });
      return;
    }

    setIsDownloading(true);
    try {
      await loadChapter(); // This will save to offline storage
      toast({
        title: "Chapter Downloaded",
        description: `${currentBook} ${currentChapter} is now available offline`,
        duration: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const book = bibleBooks.find(b => b.name === currentBook);
  
  const toggleBookmark = (verse: Verse) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark verses",
        duration: 3000,
      });
      return;
    }

    const bookmarked = isBookmarked(verse.book, verse.chapter, verse.verse);
    
    if (bookmarked) {
      // For Supabase bookmarks, we need to find the bookmark ID
      // This will be handled by the hook internally
      toast({
        title: "Remove bookmark",
        description: "Click the bookmark icon in your bookmarks page to remove",
        duration: 3000,
      });
    } else {
      addBookmark({
        book: verse.book,
        chapter: verse.chapter,
        verse_number: verse.verse,
        verse_text: verse.text,
        translation: preferences.preferredTranslation
      });
    }
  };

  const handleTranslationChange = (translationId: string) => {
    BibleApiService.setTranslation(translationId);
    loadChapter();
      toast({
        title: "Translation Changed",
        description: `Switched to ${BIBLE_TRANSLATIONS.find(t => t.id === translationId)?.name}`,
        duration: 2000,
      });
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!book) return;
    
    if (direction === 'next' && currentChapter < book.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else if (direction === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  return (
    <ErrorBoundary>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation Header */}
      <Card className="card-divine">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="h-6 w-6 text-gold" />
              <CardTitle className="text-2xl">Bible Reader</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-gold bg-gold/10">
                {book?.testament} Testament
              </Badge>
              <div title={isOnline ? "Connected - Full Bible available" : "Offline - Limited content"}>
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Translation Selection */}
          <div className="flex-1 min-w-48">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Translation</label>
            <Select 
              value={preferences.preferredTranslation} 
              onValueChange={handleTranslationChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_TRANSLATIONS.map(translation => (
                  <SelectItem key={translation.id} value={translation.id}>
                    {translation.abbreviation} - {translation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Book and Chapter Selection */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Book</label>
              <Select value={currentBook} onValueChange={setCurrentBook}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bibleBooks.map(book => (
                    <SelectItem key={book.name} value={book.name}>
                      {book.name} ({book.testament})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-32">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Chapter</label>
              <Select 
                value={currentChapter.toString()} 
                onValueChange={(value) => setCurrentChapter(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: book?.chapters || 1 }, (_, i) => i + 1).map(chapter => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      Chapter {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="flex justify-between items-center">
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => navigateChapter('prev')}
              disabled={currentChapter <= 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </EnhancedButton>
            
            <div className="flex justify-center">
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={downloadChapter}
                disabled={isDownloading || !isOnline}
                className="flex items-center space-x-2"  
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-spin' : ''}`} />
                <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
              </EnhancedButton>
            </div>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => navigateChapter('next')}
              disabled={currentChapter >= (book?.chapters || 1)}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>

      {/* Scripture Content */}
      <Card className="card-divine">
        <CardContent className="pt-6">
          <LoadingState 
            isLoading={isLoading} 
            error={error}
            loadingText="Loading scripture..."
            onRetry={loadChapter}
          >
            {/* Chapter Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-primary mb-2">
                {currentBook} {currentChapter}
              </h2>
              <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
                <span>{verses.length} verses</span>
                <span>•</span>
                <span>{BIBLE_TRANSLATIONS.find(t => t.id === preferences.preferredTranslation)?.abbreviation}</span>
                {!isOnline && <span className="text-orange-500">• Offline</span>}
              </div>
            </div>

            {verses.length > 0 ? (
              <div className="space-y-4" style={{ 
                fontSize: 'var(--reader-font-size)', 
                fontFamily: 'var(--reader-font-family)' 
              }}>
              {verses.map((verse) => {
                const bookmarked = isBookmarked(verse.book, verse.chapter, verse.verse);
                
                return (
                  <div key={`${verse.book}-${verse.chapter}-${verse.verse}`} className="group relative">
                    <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-accent/30 transition-colors">
                      <span className="text-verse-number flex-shrink-0 mt-1">
                        {verse.verse}
                      </span>
                      <p className="text-scripture flex-1 text-lg leading-relaxed">
                        {verse.text}
                      </p>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EnhancedButton
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(verse)}
                          className={`h-8 w-8 ${bookmarked ? 'text-gold' : 'text-muted-foreground'}`}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                        </EnhancedButton>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No verses available</p>
              </div>
            )}
          </LoadingState>
        </CardContent>
      </Card>
    </div>
    </ErrorBoundary>
  );
};