import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Book, ChevronLeft, ChevronRight, Bookmark, Heart } from 'lucide-react';
import { bibleBooks, sampleVerses, type Verse } from '@/data/bible';

interface BibleReaderProps {
  selectedBook?: string;
  selectedChapter?: number;
}

export const BibleReader = ({ selectedBook = 'John', selectedChapter = 3 }: BibleReaderProps) => {
  const [currentBook, setCurrentBook] = useState(selectedBook);
  const [currentChapter, setCurrentChapter] = useState(selectedChapter);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(new Set());

  const book = bibleBooks.find(b => b.name === currentBook);
  const chapterVerses = sampleVerses.filter(v => v.book === currentBook && v.chapter === currentChapter);
  
  const toggleBookmark = (verse: Verse) => {
    const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
    const newBookmarks = new Set(bookmarkedVerses);
    if (newBookmarks.has(verseKey)) {
      newBookmarks.delete(verseKey);
    } else {
      newBookmarks.add(verseKey);
    }
    setBookmarkedVerses(newBookmarks);
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation Header */}
      <Card className="card-divine">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="h-6 w-6 text-gold" />
              <CardTitle className="text-2xl">Bible Reader</CardTitle>
            </div>
            <Badge variant="secondary" className="text-gold bg-gold/10">
              {book?.testament} Testament
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
            
            <h2 className="text-xl font-semibold text-center">
              {currentBook} {currentChapter}
            </h2>
            
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
          {chapterVerses.length > 0 ? (
            <div className="space-y-4">
              {chapterVerses.map((verse) => {
                const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
                const isBookmarked = bookmarkedVerses.has(verseKey);
                
                return (
                  <div key={verseKey} className="group relative">
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
                          className={`h-8 w-8 ${isBookmarked ? 'text-gold' : 'text-muted-foreground'}`}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
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
              <p className="text-muted-foreground">
                No verses available for {currentBook} {currentChapter}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This is a demo with limited content. Try John 3, Psalms 23, or Philippians 4.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};