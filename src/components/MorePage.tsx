import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Moon, Sun, Volume2, Bell, Info, MessageCircle, Share2, Type, Download, Upload, Book, Trash2 } from 'lucide-react';
import logoImage from '@/assets/logo.png';
import { usePreferences } from '@/hooks/use-preferences';
import StorageService from '@/services/StorageService';
import { useToast } from '@/hooks/use-toast';
import { BIBLE_TRANSLATIONS } from '@/services/BibleApiService';

export const MorePage = () => {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const { toast } = useToast();

  const handleExportData = () => {
    try {
      const data = StorageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `empirial-bible-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your bookmarks and preferences have been exported",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = StorageService.importData(data);
            if (success) {
              toast({
                title: "Data Imported",
                description: "Your data has been imported successfully",
                duration: 3000,
              });
              // Refresh the page to apply changes
              window.location.reload();
            } else {
              throw new Error('Invalid data format');
            }
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import data. Please check the file format.",
              variant: "destructive",
              duration: 3000,
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const appItems = [
    {
      icon: Info,
      label: 'About Empirial Bible',
      description: 'Version 1.0.0',
      action: 'navigate',
    },
    {
      icon: MessageCircle,
      label: 'Feedback',
      description: 'Help us improve the app',
      action: 'navigate',
    },
    {
      icon: Share2,
      label: 'Share App',
      description: 'Tell others about Empirial Bible',
      action: 'navigate',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
      {/* Header */}
      <Card className="card-divine">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Empirial Bible Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Settings & More</CardTitle>
          <p className="text-muted-foreground">Customize your Bible reading experience</p>
        </CardHeader>
      </Card>

      {/* App Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gold" />
          <span>Preferences</span>
        </h2>

        <div className="space-y-4">
          {/* Theme Setting */}
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Moon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                </div>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'system') => 
                    updatePreferences({ theme: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Font Size Setting */}
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Type className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Font Size</h3>
                    <p className="text-sm text-muted-foreground">Adjust text size for reading</p>
                  </div>
                </div>
                <Select 
                  value={preferences.fontSize} 
                  onValueChange={(value: 'small' | 'medium' | 'large' | 'xl') => 
                    updatePreferences({ fontSize: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Font Family Setting */}
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Type className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Font Family</h3>
                    <p className="text-sm text-muted-foreground">Choose reading font</p>
                  </div>
                </div>
                <Select 
                  value={preferences.fontFamily} 
                  onValueChange={(value: 'inter' | 'playfair' | 'system') => 
                    updatePreferences({ fontFamily: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="playfair">Playfair</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Translation Setting */}
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Book className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Preferred Translation</h3>
                    <p className="text-sm text-muted-foreground">Default Bible translation</p>
                  </div>
                </div>
                <Select 
                  value={preferences.preferredTranslation} 
                  onValueChange={(value: string) => 
                    updatePreferences({ preferredTranslation: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIBLE_TRANSLATIONS.map(translation => (
                      <SelectItem key={translation.id} value={translation.id}>
                        {translation.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Daily Reminders Setting */}
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Bell className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Daily Reminders</h3>
                    <p className="text-sm text-muted-foreground">Get reminded to read daily</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.dailyReminders}
                  onCheckedChange={(checked) => 
                    updatePreferences({ dailyReminders: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gold" />
          <span>Data Management</span>
        </h2>

        <div className="space-y-3">
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Export Data</h3>
                    <p className="text-sm text-muted-foreground">Backup your bookmarks and settings</p>
                  </div>
                </div>
                <EnhancedButton variant="outline" size="sm" onClick={handleExportData}>
                  Export
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Import Data</h3>
                    <p className="text-sm text-muted-foreground">Restore from backup file</p>
                  </div>
                </div>
                <EnhancedButton variant="outline" size="sm" onClick={handleImportData}>
                  Import
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-destructive/10">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium">Reset All Data</h3>
                    <p className="text-sm text-muted-foreground">Clear all bookmarks and settings</p>
                  </div>
                </div>
                <EnhancedButton 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all your data.')) {
                      resetPreferences();
                      toast({
                        title: "Data Reset",
                        description: "All data has been cleared",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  Reset
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gold" />
          <span>Other Settings</span>
        </h2>

        <div className="space-y-3">
          <Card className="card-divine">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gold/10">
                    <Volume2 className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium">Audio Settings</h3>
                    <p className="text-sm text-muted-foreground">Adjust reading preferences</p>
                  </div>
                </div>
                <EnhancedButton variant="ghost" size="sm">
                  Configure
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* App Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Info className="h-5 w-5 text-gold" />
          <span>About</span>
        </h2>

        <div className="space-y-3">
          {appItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="card-divine cursor-pointer hover:scale-105 transition-transform duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gold/10">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* App Info Card */}
      <Card className="card-divine">
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Empirial Bible</h3>
            <p className="text-muted-foreground">The Word at Your Fingertips</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Version 1.0.0 MVP</p>
            <p>Built with love for spiritual growth</p>
          </div>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <span>• Daily Inspiration</span>
            <span>• Beautiful Design</span>
            <span>• Peaceful Experience</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};