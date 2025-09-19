import { useState } from "react";
import { 
  Key, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database,
  Download,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    google: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });
  const [showApiKeys, setShowApiKeys] = useState({
    google: false,
    facebook: false,
    instagram: false,
    linkedin: false,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    taskComplete: true,
    taskFailed: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleApiKeyChange = (platform: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [platform]: value }));
  };

  const toggleApiKeyVisibility = (platform: string) => {
    setShowApiKeys(prev => ({ ...prev, [platform]: !prev[platform as keyof typeof prev] }));
  };

  const saveApiKeys = () => {
    // Mock save functionality
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely stored.",
    });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly.",
    });
  };

  const deleteAllData = () => {
    toast({
      title: "Data Deletion Scheduled",
      description: "All your data will be permanently deleted within 24 hours.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and API configurations
        </p>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure your API keys for different platforms. These are encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(apiKeys).map(([platform, value]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={platform} className="capitalize font-medium">
                      {platform} API Key
                    </Label>
                    <Badge variant={value ? "default" : "secondary"}>
                      {value ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id={platform}
                        type={showApiKeys[platform as keyof typeof showApiKeys] ? "text" : "password"}
                        placeholder={`Enter your ${platform} API key`}
                        value={value}
                        onChange={(e) => handleApiKeyChange(platform, e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => toggleApiKeyVisibility(platform)}
                      >
                        {showApiKeys[platform as keyof typeof showApiKeys] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for accessing {platform} data. Keep this secure and don't share it.
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">API Key Security</p>
                  <p className="text-sm text-muted-foreground">
                    Keys are encrypted with AES-256 and stored securely
                  </p>
                </div>
                <Button onClick={saveApiKeys} variant="gradient">
                  Save API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about your scraping tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.browser}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, browser: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Task Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when scraping tasks complete successfully
                    </p>
                  </div>
                  <Switch
                    checked={notifications.taskComplete}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, taskComplete: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Task Failures</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when scraping tasks fail or encounter errors
                    </p>
                  </div>
                  <Switch
                    checked={notifications.taskFailed}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, taskFailed: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme for better visibility in low light
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme Preview</Label>
                  <div className="mt-2 p-4 rounded-lg border bg-gradient-secondary">
                    <div className="space-y-2">
                      <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-12 bg-primary rounded"></div>
                        <div className="h-6 w-12 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Export Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download all your scraping data and results
                      </p>
                    </div>
                  </div>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Delete All Data</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your tasks, results, and account data
                      </p>
                    </div>
                  </div>
                  <Button onClick={deleteAllData} variant="destructive">
                    Delete All
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Retention</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Task data is retained for 90 days after completion</p>
                  <p>• API keys are encrypted and stored securely</p>
                  <p>• Scraped results are stored until manually deleted</p>
                  <p>• Account data is retained while your account is active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}