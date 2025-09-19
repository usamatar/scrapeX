import { useState } from "react";
import { Play, Globe, Facebook, Instagram, Linkedin, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  { id: "google", name: "Google Business", icon: Globe, color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-700", bgColor: "bg-blue-50" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600", bgColor: "bg-pink-50" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-800", bgColor: "bg-blue-50" },
];

const maxResultsOptions = [
  { value: "10", label: "10 results" },
  { value: "25", label: "25 results" },
  { value: "50", label: "50 results" },
  { value: "100", label: "100 results" },
  { value: "250", label: "250 results" },
];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState("25");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a search query or URL to scrape.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one platform to scrape.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          platforms: selectedPlatforms,
          max_results: parseInt(maxResults),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Scrape Job Started",
          description: `Task ${data.task_id} has been queued successfully.`,
        });
        
        // Reset form
        setQuery("");
        setSelectedPlatforms([]);
        setMaxResults("25");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start scrape job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Start a new scraping job across multiple platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Pro Plan
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-gradient-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                New Scrape Job
              </CardTitle>
              <CardDescription>
                Enter your search query and select the platforms you want to scrape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Query Input */}
                <div className="space-y-2">
                  <Label htmlFor="query" className="text-sm font-medium">
                    Search Query or URL
                  </Label>
                  <Input
                    id="query"
                    placeholder="e.g., restaurants in New York, https://business-url.com"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a search term or paste a direct URL to the business/profile
                  </p>
                </div>

                <Separator />

                {/* Platform Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Select Platforms</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <div
                          key={platform.id}
                          className={cn(
                            "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                            isSelected 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          )}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <Checkbox
                            id={platform.id}
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent onClick
                            className="pointer-events-none"
                          />
                          <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            platform.bgColor
                          )}>
                            <platform.icon className={cn("h-4 w-4", platform.color)} />
                          </div>
                          <span className="font-medium text-sm">{platform.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Max Results */}
                <div className="space-y-2">
                  <Label htmlFor="maxResults" className="text-sm font-medium">
                    Maximum Results
                  </Label>
                  <Select value={maxResults} onValueChange={setMaxResults}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {maxResultsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Starting Scrape...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Run Scrape Job
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Tasks</span>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Results</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Platform Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Globe className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Google:</strong> Use location-based queries for best results</span>
              </div>
              <div className="flex gap-2">
                <Facebook className="h-4 w-4 text-blue-700 mt-0.5 shrink-0" />
                <span><strong>Facebook:</strong> Business pages and public profiles</span>
              </div>
              <div className="flex gap-2">
                <Instagram className="h-4 w-4 text-pink-600 mt-0.5 shrink-0" />
                <span><strong>Instagram:</strong> Business accounts and hashtags</span>
              </div>
              <div className="flex gap-2">
                <Linkedin className="h-4 w-4 text-blue-800 mt-0.5 shrink-0" />
                <span><strong>LinkedIn:</strong> Company pages and professional profiles</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}