import { Home, Book, Search, Bookmark, MoreHorizontal, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MobileMenuProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileMenu = ({ activeTab, onNavigate }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bible', label: 'Read Bible', icon: Book },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const handleNavigate = (tab: string) => {
    onNavigate(tab);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-background border-r border-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Menu</h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-md transition-colors text-left",
                        isActive 
                          ? "bg-accent text-foreground font-medium" 
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Empirial Bible v1.0
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
