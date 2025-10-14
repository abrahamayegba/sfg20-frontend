"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  CheckSquare,
  Calendar,
  Tag,
  Clock,
  Wrench,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building,
  FileText,
} from "lucide-react";
import {
  sfg20Service,
  type APIRegime,
  type APISchedule,
  type SFG20Data,
} from "@/lib/sfg20-data";
import { selectionService, type SelectionState } from "@/lib/selection-state";
import { initializeDemoData } from "@/lib/sfg20-data";

interface DataSelectionInterfaceProps {
  onContinueToExport: () => void;
  onBackToDashboard: () => void;
}

export function DataSelectionInterface({
  onContinueToExport,
  onBackToDashboard,
}: DataSelectionInterfaceProps) {
  const [data, setData] = useState<SFG20Data | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>(
    selectionService.getSelectionState()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [expandedRegimes, setExpandedRegimes] = useState<Set<string>>(
    new Set()
  );
  const [expandedSchedules, setExpandedSchedules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const cachedData = sfg20Service.getCachedData();
    if (cachedData) {
      setData(cachedData);
    } else {
      console.log("[v0] No cached data found, initializing demo data");
      initializeDemoData();
      // Try to get data again after initialization
      const retryData = sfg20Service.getCachedData();
      setData(retryData);
    }
  }, []);

  const filteredData = data
    ? {
        ...data,
        regimes: data.regimes
          .map((regime) => ({
            ...regime,
            schedules: regime.schedules.filter((schedule) => {
              const matchesSearch =
                schedule.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                schedule.rawTitle
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                schedule.tasks.some(
                  (task) =>
                    task.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    task.content
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                );

              // Extract category from schedule (could be from tasks or schedule metadata)
              const scheduleCategory =
                schedule.tasks[0]?.classification || "General";
              const matchesCategory =
                categoryFilter === "all" || scheduleCategory === categoryFilter;

              // Extract frequency from tasks
              const scheduleFrequency =
                schedule.tasks[0]?.frequency?.period || "Unknown";
              const matchesFrequency =
                frequencyFilter === "all" ||
                scheduleFrequency === frequencyFilter;

              return matchesSearch && matchesCategory && matchesFrequency;
            }),
          }))
          .filter((regime) => regime.schedules.length > 0),
      }
    : null;

  const categories = Array.from(
    new Set(
      data?.regimes.flatMap((regime) =>
        regime.schedules.flatMap((schedule) =>
          schedule.tasks.map((task) => task.classification || "General")
        )
      ) || []
    )
  );

  const frequencies = Array.from(
    new Set(
      data?.regimes.flatMap((regime) =>
        regime.schedules.flatMap((schedule) =>
          schedule.tasks.map((task) => task.frequency?.period || "Unknown")
        )
      ) || []
    )
  );

  const handleRegimeToggle = (regime: APIRegime) => {
    const allTaskIds = regime.schedules.flatMap((schedule) =>
      schedule.tasks.map((task) => task.id)
    );
    const allScheduleIds = regime.schedules.map((schedule) => schedule.id);

    // Check if regime is fully selected
    const isRegimeSelected = allScheduleIds.every((scheduleId) =>
      selectionService.isScheduleSelected(scheduleId)
    );

    if (isRegimeSelected) {
      // Deselect all schedules in regime
      allScheduleIds.forEach((scheduleId) => {
        const schedule = regime.schedules.find((s) => s.id === scheduleId);
        if (schedule && selectionService.isScheduleSelected(scheduleId)) {
          selectionService.toggleScheduleSelection(
            scheduleId,
            schedule.tasks.map((t) => t.id)
          );
        }
      });
    } else {
      // Select all schedules in regime
      regime.schedules.forEach((schedule) => {
        if (!selectionService.isScheduleSelected(schedule.id)) {
          selectionService.toggleScheduleSelection(
            schedule.id,
            schedule.tasks.map((t) => t.id)
          );
        }
      });
    }

    setSelectionState(selectionService.getSelectionState());
  };

  const handleScheduleToggle = (schedule: APISchedule) => {
    const taskIds = schedule.tasks.map((t) => t.id);
    const newState = selectionService.toggleScheduleSelection(
      schedule.id,
      taskIds
    );
    setSelectionState(newState);
  };

  const handleTaskToggle = (
    scheduleId: string,
    taskId: string,
    allTaskIds: string[]
  ) => {
    const newState = selectionService.toggleTaskSelection(
      scheduleId,
      taskId,
      allTaskIds
    );
    setSelectionState(newState);
  };

  const handleSelectAll = () => {
    if (!filteredData) return;

    // Check if all visible schedules are selected
    const allVisibleSchedules = filteredData.regimes.flatMap(
      (regime) => regime.schedules
    );
    const allSelected = allVisibleSchedules.every((schedule) =>
      selectionService.isScheduleSelected(schedule.id)
    );

    if (allSelected) {
      // Deselect all
      const newState = selectionService.clearSelection();
      setSelectionState(newState);
    } else {
      // Select all visible schedules
      allVisibleSchedules.forEach((schedule) => {
        if (!selectionService.isScheduleSelected(schedule.id)) {
          const taskIds = schedule.tasks.map((t) => t.id);
          selectionService.toggleScheduleSelection(schedule.id, taskIds);
        }
      });
      setSelectionState(selectionService.getSelectionState());
    }
  };

  const toggleRegimeExpansion = (regimeId: string) => {
    const newExpanded = new Set(expandedRegimes);
    if (newExpanded.has(regimeId)) {
      newExpanded.delete(regimeId);
    } else {
      newExpanded.add(regimeId);
    }
    setExpandedRegimes(newExpanded);
  };

  const toggleScheduleExpansion = (scheduleId: string) => {
    const newExpanded = new Set(expandedSchedules);
    if (newExpanded.has(scheduleId)) {
      newExpanded.delete(scheduleId);
    } else {
      newExpanded.add(scheduleId);
    }
    setExpandedSchedules(newExpanded);
  };

  const isRegimeSelected = (regime: APIRegime) => {
    return regime.schedules.every((schedule) =>
      selectionService.isScheduleSelected(schedule.id)
    );
  };

  const isScheduleSelected = (scheduleId: string) =>
    selectionService.isScheduleSelected(scheduleId);
  const isTaskSelected = (scheduleId: string, taskId: string) =>
    selectionService.isTaskSelected(scheduleId, taskId);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Data Available</h2>
            <p className="text-sm text-muted-foreground">
              Please import SFG20 data first.
            </p>
            <Button onClick={onBackToDashboard}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Select Maintenance Data
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose regimes, schedules and tasks to export to Simpro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button
                onClick={onContinueToExport}
                disabled={selectionState.totalSelectedTasks === 0}
                className="px-6"
              >
                Export Selected ({selectionState.totalSelectedTasks})
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search regimes, schedules, and tasks..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={frequencyFilter}
                onValueChange={setFrequencyFilter}
              >
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  {frequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleSelectAll}>
                <CheckSquare className="h-4 w-4 mr-2" />
                {filteredData &&
                filteredData.regimes
                  .flatMap((r) => r.schedules)
                  .every((s) => isScheduleSelected(s.id))
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Selection Summary */}
        {selectionState.totalSelectedTasks > 0 && (
          <Alert className="mb-6 border-accent/20 bg-accent/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>{selectionState.totalSelectedTasks} tasks</strong> from{" "}
              <strong>
                {selectionState.selectedSchedules.length} schedules
              </strong>{" "}
              selected for export.
              {selectionState.lastModified && (
                <span className="text-xs text-muted-foreground ml-2">
                  Last modified:{" "}
                  {new Date(selectionState.lastModified).toLocaleString()}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Regimes List */}
        <div className="space-y-6">
          {!filteredData || filteredData.regimes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No regimes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find maintenance
                  regimes.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredData.regimes.map((regime) => {
              const isRegimeFullySelected = isRegimeSelected(regime);
              const isRegimeExpanded = expandedRegimes.has(regime.id);
              const totalRegimeTasks = regime.schedules.reduce(
                (sum, schedule) => sum + schedule.tasks.length,
                0
              );

              return (
                <Card
                  key={regime.id}
                  className={`transition-all duration-200 ${
                    isRegimeFullySelected
                      ? "ring-2 ring-accent/20 bg-accent/5"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div
                      className="flex items-start gap-4 cursor-pointer"
                      onClick={() => toggleRegimeExpansion(regime.id)}
                    >
                      <Checkbox
                        checked={isRegimeFullySelected}
                        onCheckedChange={() => handleRegimeToggle(regime)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-gray-400 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 mb-2">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-xl">
                              {regime.name}
                            </CardTitle>
                            <Badge variant="secondary">v{regime.version}</Badge>
                            <Badge variant="outline">
                              {regime.schedules.length} schedules
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            {isRegimeExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {totalRegimeTasks} total tasks
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Regime ID: {regime.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Regime Content - Schedules */}
                  {isRegimeExpanded && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <div className="space-y-4">
                        {regime.schedules.map((schedule) => {
                          const isSelected = isScheduleSelected(schedule.id);
                          const selectedTasks =
                            selectionService.getSelectedTasksForSchedule(
                              schedule.id
                            );
                          const isExpanded = expandedSchedules.has(schedule.id);

                          return (
                            <Card
                              key={schedule.id}
                              className={`transition-all duration-200 ml-6 ${
                                isSelected
                                  ? "ring-1 ring-accent/20 bg-accent/5"
                                  : "hover:shadow-sm bg-muted/20"
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <div
                                  className="flex items-start gap-3 cursor-pointer"
                                  onClick={() =>
                                    toggleScheduleExpansion(schedule.id)
                                  }
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      handleScheduleToggle(schedule)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-gray-400 w-4 h-4"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-base">
                                          {schedule.rawTitle}
                                        </CardTitle>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          v{schedule.version}
                                        </Badge>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {schedule.code}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center text-muted-foreground">
                                        {isExpanded ? (
                                          <ChevronUp className="h-3 w-3" />
                                        ) : (
                                          <ChevronDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        {schedule.tasks.length} tasks
                                      </div>
                                      {isSelected && (
                                        <div className="flex items-center gap-1 text-accent">
                                          <CheckSquare className="h-3 w-3" />
                                          {selectedTasks.length} selected
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>

                              {/* Expanded Task Details */}
                              {isExpanded && (
                                <CardContent className="pt-0">
                                  <Separator className="mb-3" />
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-xs text-foreground mb-2">
                                      Individual Tasks:
                                    </h4>
                                    {schedule.tasks.map((task) => {
                                      const taskSelected = isTaskSelected(
                                        schedule.id,
                                        task.id
                                      );
                                      return (
                                        <div
                                          key={task.id}
                                          className={`p-2 rounded-md border transition-colors text-xs ${
                                            taskSelected
                                              ? "bg-accent/5 border-accent/20"
                                              : "bg-muted/20 hover:bg-muted/30"
                                          }`}
                                        >
                                          <div className="flex items-start gap-2">
                                            <Checkbox
                                              checked={taskSelected}
                                              onCheckedChange={() =>
                                                handleTaskToggle(
                                                  schedule.id,
                                                  task.id,
                                                  schedule.tasks.map(
                                                    (t) => t.id
                                                  )
                                                )
                                              }
                                              className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-gray-400 w-3 h-3"
                                            />
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-medium text-xs text-foreground">
                                                  {task.title}
                                                </h5>
                                                {task.linkId && (
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs px-1 py-0"
                                                  >
                                                    Smart Words: {task.linkId}
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mb-1">
                                                <div className="flex items-center gap-1">
                                                  <Clock className="h-2 w-2 text-muted-foreground" />
                                                  <span>
                                                    {task.minutes} min
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Calendar className="h-2 w-2 text-muted-foreground" />
                                                  <span>
                                                    {task.frequency?.interval}{" "}
                                                    {task.frequency?.period}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Wrench className="h-2 w-2 text-muted-foreground" />
                                                  <span>
                                                    {task.skill?.Skilling ||
                                                      "General"}
                                                  </span>
                                                </div>
                                              </div>
                                              {task.url && (
                                                <div className="mt-1">
                                                  <a
                                                    href={task.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  >
                                                    <ExternalLink className="h-2 w-2" />
                                                    View full SFG20 details
                                                  </a>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Bottom Action Bar */}
        {selectionState.totalSelectedTasks > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {selectionState.totalSelectedTasks} tasks selected from{" "}
                  {selectionState.selectedSchedules.length} schedules
                </p>
                <p className="text-sm text-muted-foreground">
                  Ready to export to Simpro
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setSelectionState(selectionService.clearSelection())
                  }
                >
                  Clear Selection
                </Button>
                <Button onClick={onContinueToExport} className="px-6">
                  Export to Simpro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
