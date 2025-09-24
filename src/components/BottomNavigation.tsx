import { Home, Book, Search, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bible', label: 'Bible', icon: Book },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 backdrop-blur-lg z-50">
      <div className="max-w-screen-sm mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-gold bg-gold/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};