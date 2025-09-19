import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  List, 
  BarChart3, 
  Settings, 
  Search,
  ChevronRight,
  Zap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: List },
  { title: "Results", url: "/results", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={cn(
      "border-r border-border bg-gradient-secondary transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ScrapeX
              </span>
              <span className="text-xs text-muted-foreground">AI-Powered Scraper</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3",
            collapsed && "sr-only"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-accent/50 hover:text-accent-foreground",
                        isActive(item.url) 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground",
                        collapsed && "justify-center"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0",
                        isActive(item.url) && "text-primary-foreground"
                      )} />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.title}</span>
                          {isActive(item.url) && (
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-8 p-4 rounded-xl bg-gradient-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Pro Tip</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Use filters and batch operations to maximize your scraping efficiency!
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}