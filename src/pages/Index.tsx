import { useState, useEffect } from 'react';
import { EmpirialHome } from '@/components/EmpirialHome';
import { BibleReader } from '@/components/BibleReader';
import { SearchBible } from '@/components/SearchBible';
import { BookmarksPage } from '@/components/BookmarksPage';
import { MorePage } from '@/components/MorePage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/auth/AuthPage';
import { MigrationPrompt } from '@/components/auth/MigrationPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { DataMigrationService } from '@/services/DataMigrationService';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showMigration, setShowMigration] = useState(false);

  // Check for migration needs when user logs in
  useEffect(() => {
    if (user && !loading) {
      const hasLocalData = DataMigrationService.hasLocalData();
      if (hasLocalData) {
        setShowMigration(true);
      }
    }
  }, [user, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth page if user is not authenticated or if requested
  if (!user || showAuthPage) {
    return <AuthPage onBack={() => setShowAuthPage(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <EmpirialHome 
            onNavigate={setActiveTab}
            onShowAuth={() => setShowAuthPage(true)}
            user={user}
          />
        );
      case 'bible':
        return <BibleReader />;
      case 'search':
        return <SearchBible />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'more':
        return (
          <MorePage 
            onShowAuth={() => setShowAuthPage(true)}
            user={user}
          />
        );
      default:
        return (
          <EmpirialHome 
            onNavigate={setActiveTab}
            onShowAuth={() => setShowAuthPage(true)}
            user={user}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Migration Prompt */}
      {showMigration && user && (
        <MigrationPrompt
          userId={user.id}
          onComplete={() => setShowMigration(false)}
          onSkip={() => setShowMigration(false)}
        />
      )}

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
