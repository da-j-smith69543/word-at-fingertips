import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Bookmark, RefreshCw } from 'lucide-react';
import { getDailyVerse, type Verse } from '@/data/bible';

export const DailyVerse = () => {
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    setIsLoading(true);
    try {
      const verse = await getDailyVerse();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Error loading daily verse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="card-divine overflow-hidden relative">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading daily verse...</p>
        </CardContent>
      </Card>
    );
  }

  if (!dailyVerse) {
    return (
      <Card className="card-divine overflow-hidden relative">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Unable to load daily verse</p>
          <EnhancedButton onClick={loadDailyVerse} variant="divine" size="sm">
            Try Again
          </EnhancedButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-divine overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Badge variant="secondary" className="text-gold bg-gold/10 font-medium">
              Daily Verse
            </Badge>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* Verse Content */}
          <div className="space-y-4">
            <blockquote className="text-xl md:text-2xl leading-relaxed text-scripture font-medium italic">
              "{dailyVerse.text}"
            </blockquote>
            
            <cite className="text-gold font-semibold text-lg not-italic">
              — {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </cite>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-3 pt-4">
            <EnhancedButton variant="ghost" size="sm" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Like</span>
            </EnhancedButton>
            
            <EnhancedButton variant="ghost" size="sm" className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </EnhancedButton>
            
            <EnhancedButton variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </EnhancedButton>
            
            <EnhancedButton 
              variant="ghost" 
              size="sm" 
              onClick={loadDailyVerse}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>New Verse</span>
            </EnhancedButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};