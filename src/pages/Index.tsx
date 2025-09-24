import { useState } from 'react';
import { EmpirialHome } from '@/components/EmpirialHome';
import { BibleReader } from '@/components/BibleReader';
import { SearchBible } from '@/components/SearchBible';
import { BookmarksPage } from '@/components/BookmarksPage';
import { MorePage } from '@/components/MorePage';
import { BottomNavigation } from '@/components/BottomNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <EmpirialHome onNavigate={setActiveTab} />;
      case 'bible':
        return <BibleReader />;
      case 'search':
        return <SearchBible />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'more':
        return <MorePage />;
      default:
        return <EmpirialHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Main Content */}
      <main className="transition-all duration-300">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
