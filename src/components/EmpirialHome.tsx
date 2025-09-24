import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { DailyVerse } from './DailyVerse';
import { Book, Search, Bookmark, Clock, Heart, Star } from 'lucide-react';
import logoImage from '@/assets/logo.png';

interface EmpirialHomeProps {
  onNavigate: (tab: string) => void;
}

export const EmpirialHome = ({ onNavigate }: EmpirialHomeProps) => {
  const quickActions = [
    { id: 'bible', label: 'Read Bible', icon: Book, description: 'Explore the scriptures' },
    { id: 'search', label: 'Search', icon: Search, description: 'Find specific verses' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, description: 'Your saved verses' },
  ];

  const recentBooks = [
    { name: 'John', chapter: 3, testament: 'New' },
    { name: 'Psalms', chapter: 23, testament: 'Old' },
    { name: 'Philippians', chapter: 4, testament: 'New' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-24">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src={logoImage} 
            alt="Empirial Bible Logo" 
            className="h-20 w-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Empirial Bible
          </h1>
          <p className="text-muted-foreground text-lg">
            The Word at Your Fingertips
          </p>
        </div>
      </header>

      {/* Daily Verse */}
      <section>
        <DailyVerse />
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id} 
                className="card-divine cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-gold/10">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent Reading */}
      <section className="space-y-4">
        <Card className="card-divine">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gold" />
              <CardTitle className="text-xl">Continue Reading</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBooks.map((book, index) => (
              <div 
                key={`${book.name}-${book.chapter}`}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => onNavigate('bible')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Book className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{book.name} {book.chapter}</p>
                    <p className="text-sm text-muted-foreground">{book.testament} Testament</p>
                  </div>
                </div>
                <EnhancedButton variant="ghost" size="sm">
                  Continue
                </EnhancedButton>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Inspirational Features */}
      <section className="space-y-4">
        <Card className="card-divine">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Daily Inspiration</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">Beautiful Design</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Book className="h-4 w-4" />
                  <span className="text-sm">Full Scripture</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Experience the Bible with modern design and peaceful spiritual atmosphere
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};