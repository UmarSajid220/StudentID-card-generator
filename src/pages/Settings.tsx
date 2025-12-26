import React from 'react';
import { 
  Palette, 
  FileImage, 
  Shield, 
  Bell, 
  Database,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Templates',
      description: 'Manage card design templates',
      icon: FileImage,
      color: 'bg-accent',
    },
    {
      title: 'Branding',
      description: 'Customize logo and colors',
      icon: Palette,
      color: 'bg-success',
    },
    {
      title: 'Security',
      description: 'Authentication and access control',
      icon: Shield,
      color: 'bg-warning',
    },
    {
      title: 'Notifications',
      description: 'Email and system alerts',
      icon: Bell,
      color: 'bg-primary',
    },
    {
      title: 'Database',
      description: 'Backup and restore data',
      icon: Database,
      color: 'bg-destructive',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system preferences and templates</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section) => (
          <button
            key={section.title}
            className="card-elevated p-5 text-left hover:shadow-elevated transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground", section.color)}>
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {section.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Settings */}
      <div className="card-elevated p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Settings</h2>
        <div className="space-y-4">
          {[
            { label: 'Auto-generate QR codes', description: 'Generate QR codes automatically for new students', enabled: true },
            { label: 'Email notifications', description: 'Send email when cards are generated', enabled: false },
            { label: 'Print watermark', description: 'Add security watermark to printed cards', enabled: true },
            { label: 'High-resolution export', description: 'Export at 300 DPI for professional printing', enabled: true },
          ].map((setting, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch defaultChecked={setting.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Active Template</h2>
          <Button variant="outline" size="sm">
            Change Template
          </Button>
        </div>
        <div className="flex items-center gap-6 p-4 bg-secondary rounded-lg">
          <div className="w-40 h-24 gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">Preview</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">UOS Standard Template</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Official university card design with QR verification
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: December 10, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
