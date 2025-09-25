import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DataMigrationService } from '@/services/DataMigrationService';
import { Upload, X, Loader2 } from 'lucide-react';

interface MigrationPromptProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const MigrationPrompt: React.FC<MigrationPromptProps> = ({
  userId,
  onComplete,
  onSkip,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    
    try {
      const result = await DataMigrationService.migrateAllData(userId);
      
      if (result.success) {
        DataMigrationService.clearLocalData();
        toast({
          title: 'Migration Complete!',
          description: 'Your bookmarks and preferences have been synced to your account.'
        });
        onComplete();
      } else {
        throw new Error(result.error || 'Migration failed');
      }
    } catch (error: any) {
      console.error('Migration error:', error);
      toast({
        variant: 'destructive',
        title: 'Migration Failed',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Ask for confirmation before skipping
    const confirmed = window.confirm(
      'Are you sure you want to skip migration? Your local data will remain on this device only.'
    );
    
    if (confirmed) {
      onSkip();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle>Sync Your Data</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            We found existing bookmarks and preferences on this device. 
            Would you like to sync them to your account?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This will upload your local bookmarks, reading history, and preferences 
              to your account so you can access them on any device.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button 
              onClick={handleMigration} 
              className="flex-1" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sync Data
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSkip} 
              disabled={isLoading}
            >
              Skip
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You can always sync your data later from the settings page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};