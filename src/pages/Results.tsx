import { useState } from "react";
import { 
  Download, 
  ExternalLink, 
  Phone, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin,
  Copy,
  Search,
  Filter,
  Grid,
  List as ListIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual API calls
const mockResults = [
  {
    id: "res_001",
    taskId: "task_001",
    platform: "google",
    businessName: "Joe's Pizza",
    description: "Authentic New York style pizza since 1985. Family owned and operated with the best ingredients.",
    phone: "+1 (555) 123-4567",
    website: "https://joespizza.com",
    address: "123 Main St, New York, NY 10001",
    rating: 4.5,
    reviewCount: 234,
    category: "Restaurant",
  },
  {
    id: "res_002", 
    taskId: "task_001",
    platform: "facebook",
    businessName: "Tony's Italian Bistro",
    description: "Traditional Italian cuisine in the heart of Manhattan. Fresh pasta made daily.",
    phone: "+1 (555) 234-5678",
    website: "https://facebook.com/tonysitalianbistro",
    address: "456 Broadway, New York, NY 10013",
    rating: 4.8,
    reviewCount: 156,
    category: "Restaurant",
  },
  {
    id: "res_003",
    taskId: "task_002",
    platform: "linkedin",
    businessName: "TechStart Inc.",
    description: "Leading technology solutions for enterprise customers. Specializing in AI and machine learning.",
    phone: "+1 (555) 345-6789",
    website: "https://techstart.com",
    address: "789 Tech Ave, San Francisco, CA 94105",
    employees: "201-500",
    industry: "Technology",
  },
  {
    id: "res_004",
    taskId: "task_001",
    platform: "instagram",
    businessName: "Brooklyn Coffee Roasters",
    description: "Artisanal coffee roasted fresh daily. Sustainable sourcing from around the world.",
    phone: "+1 (555) 456-7890",
    website: "https://instagram.com/brooklyncoffeeroasters",
    address: "321 Coffee St, Brooklyn, NY 11201",
    followers: "12.5K",
    category: "Coffee Shop",
  },
];

const platformIcons = {
  google: Globe,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

const platformColors = {
  google: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  facebook: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  instagram: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  linkedin: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
};

export default function Results() {
  const [results, setResults] = useState(mockResults);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const filteredResults = results.filter(result => {
    const matchesSearch = result.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || result.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.platform]) {
      acc[result.platform] = [];
    }
    acc[result.platform].push(result);
    return acc;
  }, {} as Record<string, typeof mockResults>);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const exportData = (format: 'csv' | 'json') => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Downloading ${filteredResults.length} results as ${format.toUpperCase()}`,
    });
  };

  const ResultCard = ({ result }: { result: typeof mockResults[0] }) => {
    const PlatformIcon = platformIcons[result.platform as keyof typeof platformIcons];
    const colors = platformColors[result.platform as keyof typeof platformColors];

    return (
      <Card className="hover:shadow-lg transition-all duration-200 animate-scale-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", colors.bg, colors.border, "border")}>
                <PlatformIcon className={cn("h-4 w-4", colors.text)} />
              </div>
              <div>
                <CardTitle className="text-lg">{result.businessName}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1 capitalize">
                  {result.platform}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {result.description}
          </p>
          
          <div className="space-y-2">
            {result.phone && (
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{result.phone}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(result.phone, "Phone number")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {result.website && (
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={result.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate max-w-[200px]"
                  >
                    Visit Website
                  </a>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(result.website!, "Website URL")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Platform-specific data */}
          <div className="pt-2 border-t">
            {result.platform === "google" && result.rating && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>⭐ {result.rating}/5</span>
                <span>({result.reviewCount} reviews)</span>
              </div>
            )}
            
            {result.platform === "instagram" && result.followers && (
              <div className="text-xs text-muted-foreground">
                {result.followers} followers
              </div>
            )}
            
            {result.platform === "linkedin" && result.employees && (
              <div className="text-xs text-muted-foreground">
                {result.employees} employees
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground mt-2">
            Browse and export your scraped data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportData('csv')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => exportData('json')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredResults.length} results
              </span>
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredResults.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              {searchQuery || platformFilter !== "all" 
                ? "Try adjusting your filters"
                : "Complete some scraping tasks to see results here"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Results ({filteredResults.length})</TabsTrigger>
            {Object.entries(groupedResults).map(([platform, platformResults]) => {
              const PlatformIcon = platformIcons[platform as keyof typeof platformIcons];
              return (
                <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                  <PlatformIcon className="h-4 w-4" />
                  {platform} ({platformResults.length})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className={cn(
              viewMode === "grid" 
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-4"
            )}>
              {filteredResults.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          </TabsContent>

          {Object.entries(groupedResults).map(([platform, platformResults]) => (
            <TabsContent key={platform} value={platform} className="space-y-6">
              <div className={cn(
                viewMode === "grid" 
                  ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                  : "space-y-4"
              )}>
                {platformResults.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}