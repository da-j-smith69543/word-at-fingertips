import { Card, CardContent } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { getDailyVerse } from '@/data/bible';

export const DailyVerse = () => {
  const dailyVerse = getDailyVerse();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};