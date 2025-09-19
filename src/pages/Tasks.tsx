import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  MoreHorizontal,
  RefreshCw,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data - replace with actual API calls
const mockTasks = [
  {
    id: "task_001",
    query: "restaurants in Manhattan",
    platforms: ["google", "facebook"],
    status: "completed",
    maxResults: 50,
    actualResults: 47,
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:35:00Z",
  },
  {
    id: "task_002", 
    query: "https://business.example.com",
    platforms: ["linkedin", "instagram"],
    status: "running",
    maxResults: 25,
    actualResults: 0,
    createdAt: "2024-01-15T11:00:00Z",
    completedAt: null,
  },
  {
    id: "task_003",
    query: "tech companies San Francisco",
    platforms: ["google", "linkedin"],
    status: "failed",
    maxResults: 100,
    actualResults: 0,
    createdAt: "2024-01-15T09:15:00Z",
    completedAt: "2024-01-15T09:18:00Z",
  },
  {
    id: "task_004",
    query: "coffee shops Brooklyn",
    platforms: ["google", "facebook", "instagram"],
    status: "pending",
    maxResults: 75,
    actualResults: 0,
    createdAt: "2024-01-15T11:30:00Z",
    completedAt: null,
  },
];

const statusConfig = {
  pending: { icon: Clock, color: "text-orange-500", bg: "bg-orange-50", label: "Pending" },
  running: { icon: Play, color: "text-blue-500", bg: "bg-blue-50", label: "Running" },
  completed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Completed" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Failed" },
};

const platformColors = {
  google: "bg-blue-100 text-blue-800",
  facebook: "bg-blue-100 text-blue-800", 
  instagram: "bg-pink-100 text-pink-800",
  linkedin: "bg-blue-100 text-blue-800",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh running tasks
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate task progress
      setTasks(prev => prev.map(task => {
        if (task.status === "running" && Math.random() > 0.7) {
          return {
            ...task,
            status: "completed",
            actualResults: Math.floor(Math.random() * task.maxResults),
            completedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getElapsedTime = (startTime: string, endTime?: string | null) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your scraping tasks
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks by ID or query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            Track the progress of your scraping jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Start your first scrape job from the dashboard"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => {
                    const StatusIcon = statusConfig[task.status as keyof typeof statusConfig].icon;
                    const statusColor = statusConfig[task.status as keyof typeof statusConfig].color;
                    
                    return (
                      <TableRow key={task.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {task.id}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {task.query}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.platforms.map((platform) => (
                              <Badge 
                                key={platform} 
                                variant="secondary"
                                className={cn(
                                  "text-xs capitalize",
                                  platformColors[platform as keyof typeof platformColors]
                                )}
                              >
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={cn("h-4 w-4", statusColor)} />
                            <span className="text-sm capitalize">
                              {statusConfig[task.status as keyof typeof statusConfig].label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {task.actualResults}/{task.maxResults}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {getElapsedTime(task.createdAt, task.completedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(task.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Results</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Cancel Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}