import { historyService } from "./history-service";
import { selectionService } from "./selection-state";
import { sfg20Service } from "./sfg20-data";

export interface SimproTask {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  skillLevel: string;
  scheduleName: string;
  category: string;
  priority: string;
  recurrence: string;
  notes?: string;
}

export interface SimproServiceLevel {
  id: string;
  name: string;
  description: string;
  responseTime: number; // in hours
  priority: "Critical" | "High" | "Medium" | "Low";
  scheduleIds: string[];
}

export interface SimproAsset {
  id: string;
  name: string;
  description: string;
  assetTag: string;
  category: string;
  location: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  serviceLevelId: string;
  customFields?: Record<string, any>;
}

export interface SimproTestReading {
  id: string;
  assetId: string;
  name: string;
  description: string;
  readingType: "Pass/Fail" | "Numeric" | "Text";
  expectedValue?: string;
  unit?: string;
  frequency: string;
  isFailurePoint: boolean;
  alertOnFailure: boolean;
}

export interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  options?: string[]; // for select type
  required: boolean;
  defaultValue?: any;
}

export interface ExportStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "skipped";
  progress: number; // 0-100
  startTime?: string;
  endTime?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
  data?: any; // Step-specific data
}

export interface MultiStepExportState {
  exportId: string;
  timestamp: string;
  currentStep: number;
  steps: ExportStep[];
  serviceLevels: SimproServiceLevel[];
  assets: SimproAsset[];
  testReadings: SimproTestReading[];
  tasks: SimproTask[];
  customFields: CustomField[];
  overallStatus:
    | "not-started"
    | "in-progress"
    | "completed"
    | "failed"
    | "partial";
  metadata: {
    exportedBy: string;
    sfg20Version: string;
    exportFormat: string;
    apiVersion: string;
    smartWordsEnabled: boolean;
  };
}

export interface SimproExportData {
  exportId: string;
  timestamp: string;
  totalTasks: number;
  schedules: {
    id: string;
    name: string;
    category: string;
    frequency: string;
    taskCount: number;
  }[];
  tasks: SimproTask[];
  metadata: {
    exportedBy: string;
    sfg20Version: string;
    exportFormat: string;
    apiVersion: string;
    smartWordsEnabled: boolean;
  };
}

export interface ExportResult {
  success: boolean;
  exportId: string;
  data: SimproExportData;
  downloadUrl?: string;
  error?: string;
}

export const exportService = {
  generateExportData: (): SimproExportData | null => {
    const selectionState = selectionService.getSelectionState();
    const sfg20Data = sfg20Service.getCachedData();

    if (!sfg20Data || selectionState.selectedSchedules.length === 0) {
      return null;
    }

    const exportId = `export_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const tasks: SimproTask[] = [];
    const schedules: SimproExportData["schedules"] = [];

    // Process each selected schedule
    selectionState.selectedSchedules.forEach((selectedSchedule) => {
      // Find the schedule across all regimes
      let foundSchedule: any = null;
      let parentRegime: any = null;

      for (const regime of sfg20Data.regimes) {
        const schedule = regime.schedules.find(
          (s) => s.id === selectedSchedule.scheduleId
        );
        if (schedule) {
          foundSchedule = schedule;
          parentRegime = regime;
          break;
        }
      }

      if (!foundSchedule || !parentRegime) return;

      // Add schedule metadata
      schedules.push({
        id: foundSchedule.id,
        name: foundSchedule.title || foundSchedule.rawTitle,
        category: foundSchedule.code || "General",
        frequency: "Monthly", // Default frequency
        taskCount: selectedSchedule.selectedTasks.length,
      });

      // Process selected tasks
      selectedSchedule.selectedTasks.forEach((taskId) => {
        const task = foundSchedule.tasks.find((t: any) => t.id === taskId);
        if (!task) return;

        tasks.push({
          id: task.id,
          name: task.title,
          description: task.content || task.title,
          estimatedDuration: task.minutes || 30,
          skillLevel: task.skill?.Skilling || "General",
          scheduleName: foundSchedule.title || foundSchedule.rawTitle,
          category: foundSchedule.code || "General",
          priority:
            task.classification === "Red"
              ? "High"
              : task.classification === "Amber"
              ? "Medium"
              : "Low",
          recurrence: task.frequency
            ? `Every ${task.frequency.interval} ${task.frequency.period}`
            : "Monthly",
          notes: task.linkId ? `SFG20 Smart Words: ${task.linkId}` : undefined,
        });
      });
    });

    return {
      exportId,
      timestamp: new Date().toISOString(),
      totalTasks: tasks.length,
      schedules,
      tasks,
      metadata: {
        exportedBy: "SFG20 Data Manager",
        sfg20Version: "v3.0",
        exportFormat: "simpro-v2",
        apiVersion: "3.0",
        smartWordsEnabled: tasks.some((task) => task.notes),
      },
    };
  },

  generateExportDataFromSelection: (storedData: any): SimproExportData => {
    const exportId = `export_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Mock data based on stored selection - in real app this would use actual imported data
    const mockTasks: SimproTask[] = [
      {
        id: "task_1",
        name: "Hoists - daily checks",
        description:
          "Operate all hohoists daily as per manufacturer's handbook to ensure safe operation",
        estimatedDuration: 7.5,
        skillLevel: "Mechanical",
        scheduleName: "Hydrotherapy Pools",
        category: "66-02",
        priority: "High",
        recurrence: "Every 1 Day",
        notes: "SFG20 Smart Words: quarter minor incident",
      },
      {
        id: "task_2",
        name: "Log book",
        description:
          "Consult the Log Book for any reported defects and take appropriate action",
        estimatedDuration: 15,
        skillLevel: "General",
        scheduleName: "Hydrotherapy Pools",
        category: "66-02",
        priority: "Medium",
        recurrence: "Every 1 Month",
        notes: "SFG20 Smart Words: negative fact decorate",
      },
      {
        id: "task_3",
        name: "Pool chemical testing",
        description:
          "Test pool chemical levels twice daily and adjust as needed for safety",
        estimatedDuration: 20,
        skillLevel: "Chemical",
        scheduleName: "Hydrotherapy Pools",
        category: "66-02",
        priority: "High",
        recurrence: "Every 2 Days",
        notes: "SFG20 Smart Words: chemical safety protocol",
      },
      {
        id: "task_4",
        name: "Filter replacement",
        description:
          "Replace air filters in all HVAC units according to maintenance schedule",
        estimatedDuration: 30,
        skillLevel: "HVAC",
        scheduleName: "HVAC Systems",
        category: "45-10",
        priority: "Low",
        recurrence: "Every 3 Months",
        notes: "SFG20 Smart Words: filter change routine",
      },
      {
        id: "task_5",
        name: "System pressure check",
        description:
          "Check system pressure and adjust as needed for optimal performance",
        estimatedDuration: 45,
        skillLevel: "HVAC",
        scheduleName: "HVAC Systems",
        category: "45-10",
        priority: "Medium",
        recurrence: "Every 1 Week",
        notes: "SFG20 Smart Words: pressure monitoring",
      },
    ];

    const mockSchedules = [
      {
        id: "schedule_1",
        name: "Hydrotherapy Pools",
        category: "66-02",
        frequency: "Daily/Monthly",
        taskCount: 3,
      },
      {
        id: "schedule_2",
        name: "HVAC Systems",
        category: "45-10",
        frequency: "Weekly/Quarterly",
        taskCount: 2,
      },
    ];

    // Filter tasks based on stored selection if available
    const selectedTaskIds = storedData.selectedTasks || [];
    const filteredTasks =
      selectedTaskIds.length > 0
        ? mockTasks.filter((task) => selectedTaskIds.includes(task.id))
        : mockTasks;

    return {
      exportId,
      timestamp: new Date().toISOString(),
      totalTasks: filteredTasks.length,
      schedules: mockSchedules,
      tasks: filteredTasks,
      metadata: {
        exportedBy: "SFG20 Data Manager",
        sfg20Version: "v3.0",
        exportFormat: "simpro-v2",
        apiVersion: "3.0",
        smartWordsEnabled: filteredTasks.some((task) => task.notes),
      },
    };
  },

  exportToSimpro: async (data: SimproExportData): Promise<ExportResult> => {
    // Simulate API call to Simpro
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, this would make an HTTP request to Simpro API
    // For demo purposes, we'll simulate success and create a downloadable JSON

    try {
      // Create downloadable JSON blob
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);

      // Store export history
      const exportHistory = exportService.getExportHistory();
      exportHistory.unshift({
        exportId: data.exportId,
        timestamp: data.timestamp,
        totalTasks: data.totalTasks,
        scheduleCount: data.schedules.length,
        regimeCount: 0,
        status: "completed",
        smartWordsEnabled: data.metadata.smartWordsEnabled,
      });

      // Keep only last 10 exports
      if (exportHistory.length > 10) {
        exportHistory.splice(10);
      }

      localStorage.setItem(
        "sfg20_export_history",
        JSON.stringify(exportHistory)
      );

      return {
        success: true,
        exportId: data.exportId,
        data,
        downloadUrl,
      };
    } catch (error) {
      return {
        success: false,
        exportId: data.exportId,
        data,
        error: error instanceof Error ? error.message : "Export failed",
      };
    }
  },

  getExportHistory: (): Array<{
    exportId: string;
    timestamp: string;
    totalTasks: number;
    scheduleCount: number;
    regimeCount?: number;
    status: string;
    smartWordsEnabled?: boolean;
  }> => {
    if (typeof window === "undefined") return [];

    const history = localStorage.getItem("sfg20_export_history");
    return history ? JSON.parse(history) : [];
  },

  downloadExportFile: (data: SimproExportData, filename?: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `sfg20-export-${data.exportId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  },

  initializeMultiStepExport: (): MultiStepExportState | null => {
    const selectionState = selectionService.getSelectionState();
    const sfg20Data = sfg20Service.getCachedData();

    if (!sfg20Data || selectionState.selectedSchedules.length === 0) {
      return null;
    }

    const exportId = `export_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Define export steps
    const steps: ExportStep[] = [
      {
        id: "validation",
        name: "Validation",
        description: "Validating selected data and checking connections",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: "service-levels",
        name: "Service Levels",
        description: "Creating service levels in simPRO",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: "assets",
        name: "Assets",
        description: "Creating assets in simPRO",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: "test-readings",
        name: "Test Readings",
        description: "Creating test readings and failure points",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: "tasks",
        name: "Tasks",
        description: "Creating maintenance tasks in simPRO",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: "verification",
        name: "Verification",
        description: "Verifying export and generating report",
        status: "pending",
        progress: 0,
        retryCount: 0,
        maxRetries: 1,
      },
    ];

    // Generate service levels from schedules
    const serviceLevels: SimproServiceLevel[] = [];
    const serviceLevelMap = new Map<string, string[]>();

    selectionState.selectedSchedules.forEach((selectedSchedule) => {
      for (const regime of sfg20Data.regimes) {
        const schedule = regime.schedules.find(
          (s) => s.id === selectedSchedule.scheduleId
        );
        if (schedule) {
          const category = schedule.code || "General";
          if (!serviceLevelMap.has(category)) {
            serviceLevelMap.set(category, []);
          }
          serviceLevelMap.get(category)!.push(schedule.id);
        }
      }
    });

    serviceLevelMap.forEach((scheduleIds, category) => {
      serviceLevels.push({
        id: `sl_${category.replace(/[^a-zA-Z0-9]/g, "_")}`,
        name: `Service Level - ${category}`,
        description: `Maintenance service level for ${category} equipment`,
        responseTime: 24,
        priority: "Medium",
        scheduleIds,
      });
    });

    // Generate assets from schedules
    const assets: SimproAsset[] = [];
    const addedAssetIds = new Set<string>();

    selectionState.selectedSchedules.forEach((selectedSchedule, index) => {
      // Only try to find the schedule once across all regimes
      const schedule = sfg20Data.regimes
        .flatMap((r) => r.schedules)
        .find((s) => s.id === selectedSchedule.scheduleId);

      if (schedule && !addedAssetIds.has(schedule.id)) {
        const serviceLevel = serviceLevels.find((sl) =>
          sl.scheduleIds.includes(schedule.id)
        );

        assets.push({
          id: `asset_${schedule.id}`,
          name: schedule.rawTitle,
          description: schedule.title,
          assetTag: `TAG-${String(index + 1).padStart(4, "0")}`,
          category: schedule.code || "General",
          location: schedule.tasks[0]?.where || "Facility",
          serviceLevelId: serviceLevel?.id || "",
          customFields: {},
        });

        addedAssetIds.add(schedule.id);
      }
    });

    // Generate test readings (failure points)
    const testReadings: SimproTestReading[] = [];
    const processedAssets = new Set<string>();
    assets.forEach((asset) => {
      if (processedAssets.has(asset.id)) return; // skip if already processed
      processedAssets.add(asset.id);

      testReadings.push({
        id: `tr_${asset.id}_operational`,
        assetId: asset.id,
        name: "Operational Status",
        description: "Check if equipment is operational",
        readingType: "Pass/Fail",
        expectedValue: "Pass",
        frequency: "Monthly",
        isFailurePoint: true,
        alertOnFailure: true,
      });

      testReadings.push({
        id: `tr_${asset.id}_safety`,
        assetId: asset.id,
        name: "Safety Check",
        description: "Verify all safety systems are functioning",
        readingType: "Pass/Fail",
        expectedValue: "Pass",
        frequency: "Monthly",
        isFailurePoint: true,
        alertOnFailure: true,
      });
    });

    // Generate tasks
    const tasks: SimproTask[] = [];
    selectionState.selectedSchedules.forEach((selectedSchedule) => {
      for (const regime of sfg20Data.regimes) {
        const schedule = regime.schedules.find(
          (s) => s.id === selectedSchedule.scheduleId
        );
        if (!schedule) continue;

        selectedSchedule.selectedTasks.forEach((taskId) => {
          const task = schedule.tasks.find((t: any) => t.id === taskId);
          if (!task) return;

          tasks.push({
            id: task.id,
            name: task.title,
            description: task.content || task.title,
            estimatedDuration: task.minutes || 30,
            skillLevel: task.skill?.Skilling || "General",
            scheduleName: schedule.title || schedule.rawTitle,
            category: schedule.code || "General",
            priority:
              task.classification === "Red"
                ? "High"
                : task.classification === "Amber"
                ? "Medium"
                : "Low",
            recurrence: task.frequency
              ? `Every ${task.frequency.interval} ${task.frequency.period}`
              : "Monthly",
            notes: task.linkId
              ? `SFG20 Smart Words: ${task.linkId}`
              : undefined,
          });
        });
      }
    });

    return {
      exportId,
      timestamp: new Date().toISOString(),
      currentStep: 0,
      steps,
      serviceLevels,
      assets,
      testReadings,
      tasks,
      customFields: [],
      overallStatus: "not-started",
      metadata: {
        exportedBy: "SFG20 Integrator",
        sfg20Version: "v3.0",
        exportFormat: "simpro-v2",
        apiVersion: "3.0",
        smartWordsEnabled: tasks.some((task) => task.notes),
      },
    };
  },

  executeExportStep: async (
    exportState: MultiStepExportState,
    stepId: string
  ): Promise<MultiStepExportState> => {
    const stepIndex = exportState.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) {
      throw new Error(`Step ${stepId} not found`);
    }

    const step = exportState.steps[stepIndex];
    step.status = "in-progress";
    step.startTime = new Date().toISOString();
    step.progress = 0;

    try {
      // Simulate API calls with progress updates
      switch (stepId) {
        case "validation":
          await exportService.executeValidationStep(exportState, step);
          break;
        case "service-levels":
          await exportService.executeServiceLevelsStep(exportState, step);
          break;
        case "assets":
          await exportService.executeAssetsStep(exportState, step);
          break;
        case "test-readings":
          await exportService.executeTestReadingsStep(exportState, step);
          break;
        case "tasks":
          await exportService.executeTasksStep(exportState, step);
          break;
        case "verification":
          await exportService.executeVerificationStep(exportState, step);
          break;
      }

      step.status = "completed";
      step.progress = 100;
      step.endTime = new Date().toISOString();
    } catch (error) {
      step.status = "failed";
      step.error = error instanceof Error ? error.message : "Unknown error";
      step.endTime = new Date().toISOString();
      step.retryCount++;
    }

    return exportState;
  },

  executeValidationStep: async (
    state: MultiStepExportState,
    step: ExportStep
  ) => {
    console.log("[v0] Starting validation step");

    // Check simPRO connection
    await new Promise((resolve) => setTimeout(resolve, 500));
    step.progress = 25;

    // Validate service levels
    await new Promise((resolve) => setTimeout(resolve, 500));
    step.progress = 50;

    // Validate assets
    await new Promise((resolve) => setTimeout(resolve, 500));
    step.progress = 75;

    // Validate tasks
    await new Promise((resolve) => setTimeout(resolve, 500));
    step.progress = 100;

    console.log("[v0] Validation complete");
  },

  executeServiceLevelsStep: async (
    state: MultiStepExportState,
    step: ExportStep
  ) => {
    console.log("[v0] Creating service levels in simPRO");

    const total = state.serviceLevels.length;
    for (let i = 0; i < total; i++) {
      const serviceLevel = state.serviceLevels[i];

      // Simulate API call to create service level
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log(`[v0] Created service level: ${serviceLevel.name}`);
      step.progress = Math.round(((i + 1) / total) * 100);

      // Simulate occasional failure for demo
      if (Math.random() < 0.05 && step.retryCount === 0) {
        throw new Error(`Failed to create service level: ${serviceLevel.name}`);
      }
    }

    step.data = { created: total };
  },

  executeAssetsStep: async (state: MultiStepExportState, step: ExportStep) => {
    console.log("[v0] Creating assets in simPRO");

    const total = state.assets.length;
    for (let i = 0; i < total; i++) {
      const asset = state.assets[i];

      // Simulate API call to create asset
      await new Promise((resolve) => setTimeout(resolve, 600));

      console.log(`[v0] Created asset: ${asset.name}`);
      step.progress = Math.round(((i + 1) / total) * 100);

      // Simulate occasional failure for demo
      if (Math.random() < 0.05 && step.retryCount === 0) {
        throw new Error(`Failed to create asset: ${asset.name}`);
      }
    }

    step.data = { created: total };
  },

  executeTestReadingsStep: async (
    state: MultiStepExportState,
    step: ExportStep
  ) => {
    console.log("[v0] Creating test readings and failure points in simPRO");

    const total = state.testReadings.length;
    for (let i = 0; i < total; i++) {
      const reading = state.testReadings[i];

      // Simulate API call to create test reading
      await new Promise((resolve) => setTimeout(resolve, 400));

      console.log(
        `[v0] Created test reading: ${reading.name} for asset ${reading.assetId}`
      );
      step.progress = Math.round(((i + 1) / total) * 100);

      // Simulate occasional failure for demo
      if (Math.random() < 0.05 && step.retryCount === 0) {
        throw new Error(`Failed to create test reading: ${reading.name}`);
      }
    }

    step.data = {
      created: total,
      failurePoints: state.testReadings.filter((r) => r.isFailurePoint).length,
    };
  },

  executeTasksStep: async (state: MultiStepExportState, step: ExportStep) => {
    console.log("[v0] Creating maintenance tasks in simPRO");

    const total = state.tasks.length;
    for (let i = 0; i < total; i++) {
      const task = state.tasks[i];

      // Simulate API call to create task
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`[v0] Created task: ${task.name}`);
      step.progress = Math.round(((i + 1) / total) * 100);

      // Simulate occasional failure for demo
      if (Math.random() < 0.05 && step.retryCount === 0) {
        throw new Error(`Failed to create task: ${task.name}`);
      }
    }

    step.data = { created: total };
  },

  executeVerificationStep: async (
    state: MultiStepExportState,
    step: ExportStep
  ) => {
    console.log("[v0] Verifying export");

    // Verify service levels
    await new Promise((resolve) => setTimeout(resolve, 400));
    step.progress = 20;

    // Verify assets
    await new Promise((resolve) => setTimeout(resolve, 400));
    step.progress = 40;

    // Verify test readings
    await new Promise((resolve) => setTimeout(resolve, 400));
    step.progress = 60;

    // Verify tasks
    await new Promise((resolve) => setTimeout(resolve, 400));
    step.progress = 80;

    // Generate report
    await new Promise((resolve) => setTimeout(resolve, 400));
    step.progress = 100;

    console.log("[v0] Verification complete");
  },

  executeMultiStepExport: async (
    exportState: MultiStepExportState,
    onProgress?: (state: MultiStepExportState) => void
  ): Promise<MultiStepExportState> => {
    exportState.overallStatus = "in-progress";

    const historyEntryId = `history_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    historyService.addEntry({
      type: "export",
      status: "in-progress",
      details: {
        tasks: exportState.tasks.length,
        assets: exportState.assets.length,
        schedules: new Set(exportState.tasks.map((t) => t.scheduleName)).size,
        destination: "SimPro",
      },
    });

    for (let i = 0; i < exportState.steps.length; i++) {
      const step = exportState.steps[i];
      exportState.currentStep = i;

      if (onProgress) {
        onProgress({ ...exportState });
      }

      await exportService.executeExportStep(exportState, step.id);

      if (onProgress) {
        onProgress({ ...exportState });
      }

      // Stop if step failed and no retries left
      if (step.status === "failed" && step.retryCount >= step.maxRetries) {
        exportState.overallStatus = "failed";
        const history = historyService.getHistory();
        const entry = history[0];
        if (entry) {
          historyService.updateEntry(entry.id, {
            status: "failed",
            details: {
              ...entry.details,
              errorMessage: step.error || "Export failed",
            },
          });
        }
        break;
      }
    }

    // Determine overall status
    const allCompleted = exportState.steps.every(
      (s) => s.status === "completed"
    );
    const anyFailed = exportState.steps.some((s) => s.status === "failed");

    if (allCompleted) {
      exportState.overallStatus = "completed";

      const history = historyService.getHistory();
      const entry = history[0];
      if (entry) {
        historyService.updateEntry(entry.id, {
          status: "success",
        });
      }

      // Save to export history
      const exportHistory = exportService.getExportHistory();
      exportHistory.unshift({
        exportId: exportState.exportId,
        timestamp: exportState.timestamp,
        totalTasks: exportState.tasks.length,
        scheduleCount: new Set(exportState.tasks.map((t) => t.scheduleName))
          .size,
        regimeCount: 0,
        status: "completed",
        smartWordsEnabled: exportState.metadata.smartWordsEnabled,
      });

      if (exportHistory.length > 10) {
        exportHistory.splice(10);
      }

      localStorage.setItem(
        "sfg20_export_history",
        JSON.stringify(exportHistory)
      );
    } else if (anyFailed) {
      exportState.overallStatus = "partial";
      const history = historyService.getHistory();
      const entry = history[0];
      if (entry) {
        historyService.updateEntry(entry.id, {
          status: "failed",
          details: {
            ...entry.details,
            errorMessage: "Some steps failed during export",
          },
        });
      }
    }

    return exportState;
  },

  retryExportStep: async (
    exportState: MultiStepExportState,
    stepId: string
  ): Promise<MultiStepExportState> => {
    const step = exportState.steps.find((s) => s.id === stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }

    if (step.retryCount >= step.maxRetries) {
      throw new Error(
        `Maximum retries (${step.maxRetries}) exceeded for step ${stepId}`
      );
    }

    // Reset step status
    step.status = "pending";
    step.progress = 0;
    step.error = undefined;

    // Execute the step
    return await exportService.executeExportStep(exportState, stepId);
  },

  addCustomField: (
    exportState: MultiStepExportState,
    field: CustomField
  ): MultiStepExportState => {
    exportState.customFields.push(field);
    return exportState;
  },

  removeCustomField: (
    exportState: MultiStepExportState,
    fieldId: string
  ): MultiStepExportState => {
    exportState.customFields = exportState.customFields.filter(
      (f) => f.id !== fieldId
    );
    return exportState;
  },

  addTestReading: (
    exportState: MultiStepExportState,
    reading: SimproTestReading
  ): MultiStepExportState => {
    exportState.testReadings.push(reading);
    return exportState;
  },

  removeTestReading: (
    exportState: MultiStepExportState,
    readingId: string
  ): MultiStepExportState => {
    exportState.testReadings = exportState.testReadings.filter(
      (r) => r.id !== readingId
    );
    return exportState;
  },
};
