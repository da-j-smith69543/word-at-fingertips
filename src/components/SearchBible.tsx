import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Search, Book, Bookmark, Wifi, WifiOff } from 'lucide-react';
import { searchVerses, type Verse } from '@/data/bible';
import { useToast } from '@/hooks/use-toast';

export const SearchBible = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchVerses(searchQuery);
      setResults(searchResults);
      
      if (searchResults.length === 0 && isOnline) {
        toast({
          title: "No Results",
          description: "Try different keywords or check your spelling",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <Card className="card-divine">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6 text-gold" />
              <CardTitle className="text-2xl">Search Scripture</CardTitle>
            </div>
            <div title={isOnline ? "Connected - Full Bible search available" : "Offline - Limited search"}>
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-orange-500" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isOnline ? "Search the entire Bible..." : "Search available content..."}
              value={query}
              onChange={handleInputChange}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          {query && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSearching ? 'Searching scripture...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
                {!isOnline && ' (offline search)'}
              </p>
              {results.length > 0 && (
                <Badge variant="secondary" className="text-gold bg-gold/10">
                  {results.length} verses
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {query && (
        <Card className="card-divine">
          <CardContent className="pt-6">
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching the scriptures...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((verse, index) => (
                  <div key={`${verse.book}-${verse.chapter}-${verse.verse}`} className="group">
                    <div className="bg-accent/20 rounded-lg p-6 hover:bg-accent/30 transition-colors">
                      {/* Verse Reference */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Book className="h-4 w-4 text-gold" />
                          <Badge variant="outline" className="font-medium">
                            {verse.book} {verse.chapter}:{verse.verse}
                          </Badge>
                        </div>
                        <EnhancedButton
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        >
                          <Bookmark className="h-4 w-4" />
                        </EnhancedButton>
                      </div>
                      
                      {/* Verse Text */}
                      <p className="text-scripture text-lg leading-relaxed">
                        {verse.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No verses found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching for words like "love", "faith", "hope", or book names like "John"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Suggestions */}
      {!query && (
        <Card className="card-divine">
          <CardHeader>
            <CardTitle className="text-lg">Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['love', 'faith', 'hope', 'peace', 'strength', 'God', 'Jesus', 'Lord'].map((term) => (
                <EnhancedButton
                  key={term}
                  variant="peaceful"
                  size="sm"
                  onClick={() => {
                    setQuery(term);
                    handleSearch(term);
                  }}
                  className="capitalize"
                >
                  {term}
                </EnhancedButton>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};