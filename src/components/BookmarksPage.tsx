import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, Trash2, Share2, Book } from 'lucide-react';
import { sampleVerses } from '@/data/bible';

export const BookmarksPage = () => {
  // Mock bookmarked verses (in a real app, this would come from storage)
  const [bookmarkedVerses] = useState([
    sampleVerses[0], // John 3:16
    sampleVerses[1], // Psalms 23:1
    sampleVerses[2], // Philippians 4:13
  ]);

  const [favoriteVerses] = useState([
    sampleVerses[0], // John 3:16
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
      {/* Header */}
      <Card className="card-divine">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bookmark className="h-6 w-6 text-gold" />
            <CardTitle className="text-2xl">Saved Verses</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Bookmarked Verses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-gold" />
            <span>Bookmarks</span>
          </h2>
          <Badge variant="secondary" className="text-gold bg-gold/10">
            {bookmarkedVerses.length} verses
          </Badge>
        </div>

        <div className="space-y-4">
          {bookmarkedVerses.map((verse, index) => {
            const isFavorite = favoriteVerses.some(fav => 
              fav.book === verse.book && fav.chapter === verse.chapter && fav.verse === verse.verse
            );

            return (
              <Card key={`bookmark-${index}`} className="card-divine group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Verse Reference */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Book className="h-4 w-4 text-gold" />
                        <Badge variant="outline" className="font-medium">
                          {verse.book} {verse.chapter}:{verse.verse}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EnhancedButton
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </EnhancedButton>
                        <EnhancedButton variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Share2 className="h-4 w-4" />
                        </EnhancedButton>
                        <EnhancedButton variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </EnhancedButton>
                      </div>
                    </div>

                    {/* Verse Text */}
                    <blockquote className="text-scripture text-lg leading-relaxed">
                      "{verse.text}"
                    </blockquote>

                    {/* Date Added (mock) */}
                    <p className="text-xs text-muted-foreground">
                      Saved {Math.floor(Math.random() * 10) + 1} days ago
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Favorites Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Favorites</span>
          </h2>
          <Badge variant="secondary" className="text-red-500 bg-red-50">
            {favoriteVerses.length} verses
          </Badge>
        </div>

        <div className="space-y-4">
          {favoriteVerses.map((verse, index) => (
            <Card key={`favorite-${index}`} className="card-divine group border-red-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <Badge variant="outline" className="font-medium border-red-200 text-red-700">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </Badge>
                    </div>
                  </div>

                  <blockquote className="text-scripture text-lg leading-relaxed">
                    "{verse.text}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Empty State (if no bookmarks) */}
      {bookmarkedVerses.length === 0 && (
        <Card className="card-divine">
          <CardContent className="text-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved verses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring the Bible and save verses that inspire you
            </p>
            <EnhancedButton variant="divine">
              Explore Scripture
            </EnhancedButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
};