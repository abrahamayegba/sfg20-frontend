"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Settings,
  LogOut,
  Link2,
  Download,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Building,
  FileText,
  Users,
  History,
} from "lucide-react";
import { authService } from "@/lib/auth";
import Image from "next/image";
import { NotificationCenter } from "../notifications/notification-center";

interface MainNavigationProps {
  onLogout: () => void;
  onNavigate: (view: string) => void;
  connectionStatus: {
    sfg20: boolean;
    simpro: boolean;
  };
  importStats?: {
    regimes: number;
    schedules: number;
    tasks: number;
    lastImport?: string;
  };
}

export function MainNavigation({
  onLogout,
  onNavigate,
  connectionStatus,
  importStats,
}: MainNavigationProps) {
  const user = authService.getCurrentUser();

  const navigationCards = [
    {
      id: "connections",
      title: "Connections",
      description: "Manage your SFG20 and Simpro connections",
      icon: Link2,
      status:
        connectionStatus.sfg20 && connectionStatus.simpro
          ? "connected"
          : "disconnected",
      action: () => onNavigate("connections"),
    },
    {
      id: "import",
      title: "Import from SFG20",
      description: "Import maintenance regimes and schedules",
      icon: Database,
      status: importStats?.regimes ? "completed" : "pending",
      disabled: !connectionStatus.sfg20,
      action: () => onNavigate("import"),
    },
    {
      id: "export",
      title: "Export to Simpro",
      description: "Send mapped data to your Simpro system",
      icon: Download,
      status: "pending",
      disabled: !connectionStatus.simpro,
      action: () => onNavigate("export"),
    },
    {
      id: "history",
      title: "Import & Export History",
      description: "View all your data transfer activities",
      icon: History,
      status: "available",
      action: () => onNavigate("history"),
    },
    {
      id: "templates",
      title: "Templates",
      description: "Use pre-configured mapping templates",
      icon: FileText,
      status: "available",
      action: () => onNavigate("templates"),
    },
    {
      id: "guide",
      title: "User Guide",
      description: "Learn how to use the application",
      icon: BookOpen,
      status: "available",
      action: () => onNavigate("guide"),
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Zap className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Connected
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        );
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/ignite-logo.png"
                alt="Ignite Consultancy Services"
                width={180}
                height={60}
                className="h-[50px] w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter onNavigate={onNavigate} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Connection Status Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Current status of your integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">SFG20</span>
                  </div>
                  {getStatusBadge(
                    connectionStatus.sfg20 ? "connected" : "disconnected"
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Simpro</span>
                  </div>
                  {getStatusBadge(
                    connectionStatus.simpro ? "connected" : "disconnected"
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Data Sync</span>
                  </div>
                  {getStatusBadge(
                    importStats?.regimes ? "completed" : "pending"
                  )}
                </div>
              </div>

              {importStats && (
                <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">
                        {importStats.regimes}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Regimes
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">
                        {importStats.schedules}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Schedules
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">
                        {importStats.tasks}
                      </div>
                      <div className="text-sm text-muted-foreground">Tasks</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Last Import
                      </div>
                      <div className="text-sm font-medium">
                        {importStats.lastImport
                          ? new Date(
                              importStats.lastImport
                            ).toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                  card.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
                onClick={card.disabled ? undefined : card.action}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-accent" />
                      {card.title}
                    </div>
                    {getStatusIcon(card.status)}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(card.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={card.disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!card.disabled) card.action();
                      }}
                    >
                      {card.disabled ? "Disabled" : "Open"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!connectionStatus.sfg20}
                  onClick={() => onNavigate("import")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Quick Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("templates")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("guide")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("connections")}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Manage Connections
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("history")}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
