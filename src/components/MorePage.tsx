import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Switch } from '@/components/ui/switch';
import { Settings, Moon, Sun, Volume2, Bell, Info, MessageCircle, Share2 } from 'lucide-react';
import logoImage from '@/assets/logo.png';

export const MorePage = () => {
  const settingsItems = [
    {
      icon: Moon,
      label: 'Dark Mode',
      description: 'Switch to peaceful evening theme',
      action: 'toggle',
    },
    {
      icon: Volume2,
      label: 'Audio Settings',
      description: 'Adjust reading preferences',
      action: 'navigate',
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Daily verse reminders',
      action: 'toggle',
    },
  ];

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

        <div className="space-y-3">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="card-divine">
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
                    {item.action === 'toggle' ? (
                      <Switch />
                    ) : (
                      <EnhancedButton variant="ghost" size="sm">
                        Configure
                      </EnhancedButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
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