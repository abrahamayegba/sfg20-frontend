"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Calendar,
} from "lucide-react";
import { historyService, type HistoryEntry } from "@/lib/history-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HistoryInterfaceProps {
  onBack: () => void;
}

export function HistoryInterface({ onBack }: HistoryInterfaceProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "import" | "export">("all");

  useEffect(() => {
    historyService.initializeDemoHistory();
    loadHistory();
  }, []);

  const loadHistory = () => {
    const entries = historyService.getHistory();
    setHistory(entries);
  };

  const handleClearHistory = () => {
    historyService.clearHistory();
    loadHistory();
  };

  const filteredHistory = history.filter((entry) => {
    if (filter === "all") return true;
    return entry.type === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const stats = {
    total: history.length,
    imports: history.filter((e) => e.type === "import").length,
    exports: history.filter((e) => e.type === "export").length,
    successful: history.filter((e) => e.status === "success").length,
    failed: history.filter((e) => e.status === "failed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Import & Export History
                </h1>
                <p className="text-sm text-muted-foreground">
                  View all your data transfer activities
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={history.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all import and export history
                    records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Summary of your import and export activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {stats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Activities
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    {stats.imports}
                  </div>
                  <div className="text-sm text-muted-foreground">Imports</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">
                    {stats.exports}
                  </div>
                  <div className="text-sm text-muted-foreground">Exports</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {stats.successful}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Successful
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {stats.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Activities
          </Button>
          <Button
            variant={filter === "import" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("import")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Imports Only
          </Button>
          <Button
            variant={filter === "export" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Exports Only
          </Button>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No History Found</h3>
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "You haven't performed any imports or exports yet."
                  : `No ${filter} activities found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((entry) => {
              const { date, time } = formatDate(entry.timestamp);
              return (
                <Card
                  key={entry.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-muted rounded-lg">
                          {entry.type === "import" ? (
                            <Upload className="h-6 w-6 text-blue-500" />
                          ) : (
                            <Download className="h-6 w-6 text-purple-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold capitalize">
                              {entry.type}
                            </h3>
                            {getStatusBadge(entry.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            {entry.details.regimes !== undefined && (
                              <div>
                                <span className="text-muted-foreground">
                                  Regimes:
                                </span>
                                <span className="ml-2 font-medium">
                                  {entry.details.regimes}
                                </span>
                              </div>
                            )}
                            {entry.details.schedules !== undefined && (
                              <div>
                                <span className="text-muted-foreground">
                                  Schedules:
                                </span>
                                <span className="ml-2 font-medium">
                                  {entry.details.schedules}
                                </span>
                              </div>
                            )}
                            {entry.details.tasks !== undefined && (
                              <div>
                                <span className="text-muted-foreground">
                                  Tasks:
                                </span>
                                <span className="ml-2 font-medium">
                                  {entry.details.tasks}
                                </span>
                              </div>
                            )}
                            {entry.details.assets !== undefined && (
                              <div>
                                <span className="text-muted-foreground">
                                  Assets:
                                </span>
                                <span className="ml-2 font-medium">
                                  {entry.details.assets}
                                </span>
                              </div>
                            )}
                          </div>
                          {entry.details.source && (
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium">Source:</span>{" "}
                              {entry.details.source}
                            </div>
                          )}
                          {entry.details.destination && (
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium">Destination:</span>{" "}
                              {entry.details.destination}
                            </div>
                          )}
                          {entry.details.errorMessage && (
                            <div className="text-sm text-red-500 mt-2">
                              <span className="font-medium">Error:</span>{" "}
                              {entry.details.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusIcon(entry.status)}
                        <div className="text-right text-sm">
                          <div className="font-medium">{date}</div>
                          <div className="text-muted-foreground">{time}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
