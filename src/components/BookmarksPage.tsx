import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, Trash2, Share2, Book, Edit3, User } from 'lucide-react';
import { useSupabaseBookmarks, type SupabaseBookmark } from '@/hooks/use-supabase-bookmarks';
import { LoadingState } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

export const BookmarksPage = () => {
  const { user } = useAuth();
  const { bookmarks, removeBookmark, toggleFavorite, updateNote, getFavorites, loading } = useSupabaseBookmarks();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteVerses = getFavorites();
  
  // Filter bookmarks based on search
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.verse_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bookmark.note && bookmark.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditNote = (bookmarkId: string, currentNote: string = '') => {
    setEditingNote(bookmarkId);
    setNoteText(currentNote);
  };

  const handleSaveNote = (bookmarkId: string) => {
    updateNote(bookmarkId, noteText);
    setEditingNote(null);
    setNoteText('');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const handleShare = async (bookmark: SupabaseBookmark) => {
    const shareText = `"${bookmark.verse_text}" - ${bookmark.book} ${bookmark.chapter}:${bookmark.verse_number}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: shareText,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // You could show a toast here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  // Show auth prompt if not signed in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
        <Card className="card-divine">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Sign in to view bookmarks</h2>
              <p className="text-muted-foreground">
                Your saved verses will appear here when you sign in to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
      {/* Header */}
      <Card className="card-divine">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bookmark className="h-6 w-6 text-gold" />
            <CardTitle className="text-2xl">Saved Verses</CardTitle>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-divine">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{bookmarks.length}</div>
            <div className="text-sm text-muted-foreground">Total Bookmarks</div>
          </CardContent>
        </Card>
        <Card className="card-divine">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{favoriteVerses.length}</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </CardContent>
        </Card>
        <Card className="card-divine">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(bookmarks.map(b => b.book)).size}
            </div>
            <div className="text-sm text-muted-foreground">Books</div>
          </CardContent>
        </Card>
        <Card className="card-divine">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary-foreground">
              {bookmarks.filter(b => b.note).length}
            </div>
            <div className="text-sm text-muted-foreground">With Notes</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookmarked Verses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-gold" />
            <span>Bookmarks</span>
          </h2>
          <Badge variant="secondary" className="text-gold bg-gold/10">
            {filteredBookmarks.length} verses
          </Badge>
        </div>

        <LoadingState isLoading={false} error={null}>
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-4">
              {filteredBookmarks.map((bookmark) => {
                const isFavorite = bookmark.is_favorite;
                const isEditing = editingNote === bookmark.id;

                return (
                  <Card key={bookmark.id} className="card-divine group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Verse Reference */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Book className="h-4 w-4 text-gold" />
                        <Badge variant="outline" className="font-medium">
                          {bookmark.book} {bookmark.chapter}:{bookmark.verse_number}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EnhancedButton
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(bookmark.id)}
                          className={`h-8 w-8 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleShare(bookmark)}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <Share2 className="h-4 w-4" />
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditNote(bookmark.id, bookmark.note)}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <Edit3 className="h-4 w-4" />
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeBookmark(bookmark.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </EnhancedButton>
                      </div>
                    </div>

                    {/* Verse Text */}
                    <blockquote className="text-scripture text-lg leading-relaxed">
                      "{bookmark.verse_text}"
                    </blockquote>

                    {/* Note Section */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a personal note..."
                          className="min-h-20"
                        />
                        <div className="flex space-x-2">
                          <EnhancedButton 
                            size="sm" 
                            onClick={() => handleSaveNote(bookmark.id)}
                          >
                            Save
                          </EnhancedButton>
                          <EnhancedButton 
                            size="sm" 
                            variant="outline" 
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </EnhancedButton>
                        </div>
                      </div>
                    ) : bookmark.note ? (
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Personal Note:</p>
                        <p className="text-sm">{bookmark.note}</p>
                      </div>
                    ) : null}

                    {/* Date Added */}
                    <p className="text-xs text-muted-foreground">
                      Saved {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
                );
              })}
            </div>
          ) : (
            <Card className="card-divine">
              <CardContent className="text-center py-12">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'No matching bookmarks' : 'No bookmarks yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start exploring the Bible and save verses that inspire you'
                  }
                </p>
                {!searchQuery && (
                  <EnhancedButton variant="divine">
                    Explore Scripture
                  </EnhancedButton>
                )}
              </CardContent>
            </Card>
          )}
        </LoadingState>
      </section>

      {/* Favorites Section */}
      {favoriteVerses.length > 0 && (
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
            {favoriteVerses.map((bookmark) => (
              <Card key={`favorite-${bookmark.id}`} className="card-divine group border-red-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <Badge variant="outline" className="font-medium border-red-200 text-red-700">
                        {bookmark.book} {bookmark.chapter}:{bookmark.verse_number}
                      </Badge>
                    </div>
                  </div>

                  <blockquote className="text-scripture text-lg leading-relaxed">
                    "{bookmark.verse_text}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </section>
      )}
    </div>
    </ErrorBoundary>
  );
};