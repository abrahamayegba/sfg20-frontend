// SFG20 API v3.0 data structures based on official API documentation

export interface APIRegime {
  id: string;
  name: string;
  version: string;
}

export interface APIFrequency {
  interval: number;
  period: "Day" | "Week" | "Month" | "Year" | "Hour" | "Minute" | "Unknown";
}

export interface APISkill {
  Skilling: string;
  SkillingCode: string;
  CoreSkillingID: string;
  Rate?: number;
  _id: string;
}

export interface APISchedule {
  id: string;
  code: string;
  title: string;
  rawTitle: string;
  version: string;
  modified: string;
  retired: boolean;
  scheduleCategories: string[];
  tasks: APITask[];
}

export interface APITask {
  id: string;
  title: string;
  content: string; // AI-processed aide memoire content
  fullContent: string; // Original plaintext content
  fullHtmlContent: string; // HTML formatted content
  steps: string[]; // Individual steps array
  linkId: string; // Smart Words (3-word phrase)
  url: string; // URL to full task details in Facilities-iQ
  intervalInHours: number;
  minutes: number; // Estimated duration
  frequency: APIFrequency;
  skill: APISkill;
  schedule: Pick<APISchedule, "id" | "code" | "title">;
  classification: "Red" | "Pink" | "Amber" | "Green";
  where?: string; // Location information
  date: string;
}

export interface APIAsset {
  id: string;
  index: number;
  description?: string;
  tag?: string;
  summary?: string;
  category?: string;
  floor?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  assetCriticality?: string;
  facility?: string;
  space?: string;
  code?: string;
  system?: string;
  condition?: string;
  serialNumber?: string;
  energyEfficiency?: string;
  carbon?: string;
  annualServiceDate?: string;
  warrantyExpiry?: string;
  isRealAsset: boolean;
}

export interface StepResult {
  regimeInfo: APIRegime;
  assets: APIAsset[];
  frequencies: APIFrequency[];
  schedules: APISchedule[];
  skills: APISkill[];
  tasks: APITask[];
  guid: string;
  words: string; // Smart Words for the regime
  shareLink?: { id: string; url: string }; // Added for share link metadata
}

export interface SFG20Data {
  regimes: StepResult[];
  totalCount: number;
  lastImported: string;
}

// Mock SFG20 data matching the new API structure
const mockAPISkills: APISkill[] = [
  {
    Skilling: "HVAC Technician",
    SkillingCode: "HVAC001",
    CoreSkillingID: "skill_001",
    Rate: 45.0,
    _id: "skill_hvac_001",
  },
  {
    Skilling: "Fire Safety Engineer",
    SkillingCode: "FIRE001",
    CoreSkillingID: "skill_002",
    Rate: 55.0,
    _id: "skill_fire_001",
  },
  {
    Skilling: "Electrical Technician",
    SkillingCode: "ELEC001",
    CoreSkillingID: "skill_003",
    Rate: 42.0,
    _id: "skill_elec_001",
  },
  {
    Skilling: "Mechanical Engineer",
    SkillingCode: "MECH001",
    CoreSkillingID: "skill_004",
    Rate: 50.0,
    _id: "skill_mech_001",
  },
];

const mockStepResults: StepResult[] = [
  {
    regimeInfo: {
      id: "ifhVJoSJviLtNG",
      name: "Region 1 - Regime",
      version: "2",
    },
    guid: "d21b8078-0faf-5099-8692-c12739794f0e",
    words: "craft peace ignore",
    assets: [],
    frequencies: [
      { interval: 1, period: "Month" },
      { interval: 3, period: "Month" },
      { interval: 1, period: "Year" },
    ],
    skills: mockAPISkills,
    schedules: [
      {
        id: "au_pOJgDdiFRxQ!433",
        code: "05-38-0018",
        title:
          "Region 1 - Regime › Royal Infirmary - Facility - Biomass Boiler",
        rawTitle: "Biomass Boiler",
        version: "8",
        modified: "2024-01-25T15:35:43.04505Z",
        retired: false,
        scheduleCategories: ["SFG20 > Boilers/Heat Generators"],
        tasks: [
          {
            id: "task_biomass_001",
            title: "Visual Inspection",
            content:
              "* Check for visible damage, corrosion, or leaks on boiler exterior and connections.\n* Inspect flue and ventilation systems for blockages or damage.\n* Verify all safety labels and documentation are present and legible.\n\nSmart Words: boiler visual check",
            fullContent:
              "Perform comprehensive visual inspection of biomass boiler system including exterior casing, pipe connections, flue system, and all associated safety equipment.",
            fullHtmlContent:
              "<p>Perform comprehensive visual inspection of biomass boiler system including:</p><ul><li>Exterior casing</li><li>Pipe connections</li><li>Flue system</li><li>Safety equipment</li></ul>",
            steps: [
              "Check for visible damage, corrosion, or leaks on boiler exterior and connections",
              "Inspect flue and ventilation systems for blockages or damage",
              "Verify all safety labels and documentation are present and legible",
            ],
            linkId: "boiler visual check",
            url: "https://facilities-iq.com/sfg20?phrase=boiler+visual+check",
            intervalInHours: 8760,
            minutes: 30,
            frequency: { interval: 1, period: "Year" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!433",
              code: "05-38-0018",
              title: "Biomass Boiler",
            },
            classification: "Amber",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T09:00:00Z",
          },
        ],
      },
      {
        id: "au_pOJgDdiFRxQ!361",
        code: "05-31-0020",
        title:
          "Region 1 - Regime › Royal Infirmary - Facility - Air to Water Heat Pump",
        rawTitle: "Air to Water Heat Pump",
        version: "11",
        modified: "2025-01-29T15:48:49.9093779Z",
        retired: false,
        scheduleCategories: ["SFG20 > Boilers/Heat Generators"],
        tasks: [
          {
            id: "task_heatpump_001",
            title: "Heat Pump Maintenance",
            content:
              "* Inspect heat pump unit for damage or wear.\n* Check refrigerant levels and system pressure.\n* Clean filters and verify airflow.\n* Test control systems and temperature sensors.\n\nSmart Words: heat pump check",
            fullContent:
              "Comprehensive maintenance of air to water heat pump including inspection, cleaning, and testing of all major components.",
            fullHtmlContent:
              "<p>Comprehensive heat pump maintenance including:</p><ul><li>Unit inspection</li><li>Refrigerant check</li><li>Filter cleaning</li><li>Control testing</li></ul>",
            steps: [
              "Inspect heat pump unit for damage or wear",
              "Check refrigerant levels and system pressure",
              "Clean filters and verify airflow",
              "Test control systems and temperature sensors",
            ],
            linkId: "heat pump check",
            url: "https://facilities-iq.com/sfg20?phrase=heat+pump+check",
            intervalInHours: 2190,
            minutes: 45,
            frequency: { interval: 3, period: "Month" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!361",
              code: "05-31-0020",
              title: "Air to Water Heat Pump",
            },
            classification: "Amber",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T10:00:00Z",
          },
        ],
      },
      {
        id: "au_pOJgDdiFRxQ!9",
        code: "05-03-0009",
        title:
          "Region 1 - Regime › Royal Infirmary - Facility - Atmospheric Gas Burner - Free Standing Boiler",
        rawTitle: "Atmospheric Gas Burner - Free Standing Boiler",
        version: "9",
        modified: "2025-01-29T15:48:43.4510844Z",
        retired: false,
        scheduleCategories: ["SFG20 > Boilers/Heat Generators"],
        tasks: [
          {
            id: "task_gasboiler_001",
            title: "Gas Boiler Service",
            content:
              "* Test combustion efficiency and emissions.\n* Inspect burner and heat exchanger.\n* Check gas pressure and connections.\n* Verify safety controls and interlocks.\n\nSmart Words: gas boiler service",
            fullContent:
              "Annual service of atmospheric gas burner free standing boiler including combustion testing, safety checks, and component inspection.",
            fullHtmlContent:
              "<p>Annual gas boiler service including:</p><ul><li>Combustion testing</li><li>Burner inspection</li><li>Gas pressure check</li><li>Safety verification</li></ul>",
            steps: [
              "Test combustion efficiency and emissions",
              "Inspect burner and heat exchanger",
              "Check gas pressure and connections",
              "Verify safety controls and interlocks",
            ],
            linkId: "gas boiler service",
            url: "https://facilities-iq.com/sfg20?phrase=gas+boiler+service",
            intervalInHours: 8760,
            minutes: 60,
            frequency: { interval: 1, period: "Year" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!9",
              code: "05-03-0009",
              title: "Atmospheric Gas Burner - Free Standing Boiler",
            },
            classification: "Red",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T11:00:00Z",
          },
        ],
      },
    ],
    tasks: [],
  },
  {
    regimeInfo: {
      id: "r2Jsk98KLmZ2uQ",
      name: "Region 2 - Regime",
      version: "1",
    },
    guid: "a67d3f2a-9b44-59a1-9333-f19a742a92c1",
    words: "green focus repair",
    assets: [],
    frequencies: [
      { interval: 1, period: "Month" },
      { interval: 6, period: "Month" },
    ],
    skills: mockAPISkills,
    schedules: [
      {
        id: "au_r2Jsk98KLmZ2uQ!101",
        code: "06-10-0002",
        title:
          "Region 2 - Regime › City Hospital - Facility - Air Handling Unit",
        rawTitle: "Air Handling Unit",
        version: "3",
        modified: "2025-02-12T11:00:00Z",
        retired: false,
        scheduleCategories: ["SFG20 > Ventilation Systems"],
        tasks: [
          {
            id: "task_biomass_001",
            title: "Visual Inspection",
            content:
              "* Check for visible damage, corrosion, or leaks on boiler exterior and connections.\n* Inspect flue and ventilation systems for blockages or damage.\n* Verify all safety labels and documentation are present and legible.\n\nSmart Words: boiler visual check",
            fullContent:
              "Perform comprehensive visual inspection of biomass boiler system including exterior casing, pipe connections, flue system, and all associated safety equipment.",
            fullHtmlContent:
              "<p>Perform comprehensive visual inspection of biomass boiler system including:</p><ul><li>Exterior casing</li><li>Pipe connections</li><li>Flue system</li><li>Safety equipment</li></ul>",
            steps: [
              "Check for visible damage, corrosion, or leaks on boiler exterior and connections",
              "Inspect flue and ventilation systems for blockages or damage",
              "Verify all safety labels and documentation are present and legible",
            ],
            linkId: "boiler visual check",
            url: "https://facilities-iq.com/sfg20?phrase=boiler+visual+check",
            intervalInHours: 8760,
            minutes: 30,
            frequency: { interval: 1, period: "Year" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!433",
              code: "05-38-0018",
              title: "Biomass Boiler",
            },
            classification: "Amber",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T09:00:00Z",
          },
        ],
      },
    ],
    tasks: [],
  },
  {
    regimeInfo: {
      id: "r3Ux9PhTsvyqL0",
      name: "Region 3 - Regime",
      version: "4",
    },
    guid: "f91bdf27-4115-5378-9b01-20aa9e78f889",
    words: "maintain heat control",
    assets: [],
    frequencies: [
      { interval: 3, period: "Month" },
      { interval: 12, period: "Month" },
    ],
    skills: mockAPISkills,
    schedules: [
      {
        id: "au_r3Ux9PhTsvyqL0!222",
        code: "07-22-0015",
        title:
          "Region 3 - Regime › Regional Health Centre - Facility - Chilled Water Pump",
        rawTitle: "Chilled Water Pump",
        version: "7",
        modified: "2025-02-13T10:30:00Z",
        retired: false,
        scheduleCategories: ["SFG20 > Pumps"],
        tasks: [
          {
            id: "task_biomass_001",
            title: "Visual Inspection",
            content:
              "* Check for visible damage, corrosion, or leaks on boiler exterior and connections.\n* Inspect flue and ventilation systems for blockages or damage.\n* Verify all safety labels and documentation are present and legible.\n\nSmart Words: boiler visual check",
            fullContent:
              "Perform comprehensive visual inspection of biomass boiler system including exterior casing, pipe connections, flue system, and all associated safety equipment.",
            fullHtmlContent:
              "<p>Perform comprehensive visual inspection of biomass boiler system including:</p><ul><li>Exterior casing</li><li>Pipe connections</li><li>Flue system</li><li>Safety equipment</li></ul>",
            steps: [
              "Check for visible damage, corrosion, or leaks on boiler exterior and connections",
              "Inspect flue and ventilation systems for blockages or damage",
              "Verify all safety labels and documentation are present and legible",
            ],
            linkId: "boiler visual check",
            url: "https://facilities-iq.com/sfg20?phrase=boiler+visual+check",
            intervalInHours: 8760,
            minutes: 30,
            frequency: { interval: 1, period: "Year" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!433",
              code: "05-38-0018",
              title: "Biomass Boiler",
            },
            classification: "Amber",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T09:00:00Z",
          },
        ],
      },
    ],
    tasks: [],
  },

  // ===== REGION 4 =====
  {
    regimeInfo: {
      id: "r4Pz01YnmBq6Rt",
      name: "Region 4 - Regime",
      version: "3",
    },
    guid: "c63aee51-b27a-5a9f-84f3-8a620e3e8c44",
    words: "inspect flow secure",
    assets: [],
    frequencies: [
      { interval: 1, period: "Month" },
      { interval: 3, period: "Month" },
    ],
    skills: mockAPISkills,
    schedules: [
      {
        id: "au_r4Pz01YnmBq6Rt!301",
        code: "08-19-0021",
        title:
          "Region 4 - Regime › Western Campus - Facility - Fire Sprinkler System",
        rawTitle: "Fire Sprinkler System",
        version: "2",
        modified: "2025-02-14T12:00:00Z",
        retired: false,
        scheduleCategories: ["SFG20 > Fire Safety Systems"],
        tasks: [
          {
            id: "task_biomass_001",
            title: "Visual Inspection",
            content:
              "* Check for visible damage, corrosion, or leaks on boiler exterior and connections.\n* Inspect flue and ventilation systems for blockages or damage.\n* Verify all safety labels and documentation are present and legible.\n\nSmart Words: boiler visual check",
            fullContent:
              "Perform comprehensive visual inspection of biomass boiler system including exterior casing, pipe connections, flue system, and all associated safety equipment.",
            fullHtmlContent:
              "<p>Perform comprehensive visual inspection of biomass boiler system including:</p><ul><li>Exterior casing</li><li>Pipe connections</li><li>Flue system</li><li>Safety equipment</li></ul>",
            steps: [
              "Check for visible damage, corrosion, or leaks on boiler exterior and connections",
              "Inspect flue and ventilation systems for blockages or damage",
              "Verify all safety labels and documentation are present and legible",
            ],
            linkId: "boiler visual check",
            url: "https://facilities-iq.com/sfg20?phrase=boiler+visual+check",
            intervalInHours: 8760,
            minutes: 30,
            frequency: { interval: 1, period: "Year" },
            skill: mockAPISkills[0],
            schedule: {
              id: "au_pOJgDdiFRxQ!433",
              code: "05-38-0018",
              title: "Biomass Boiler",
            },
            classification: "Amber",
            where: "Royal Infirmary - Facility",
            date: "2024-12-01T09:00:00Z",
          },
        ],
      },
    ],
    tasks: [],
  },
];

import { historyService } from "./history-service";

// Simulate SFG20 API v3.0 with GraphQL-style queries
export const sfg20Service = {
  importDataWithShareLinks: async (
    accessToken: string,
    shareLinks: Array<{ id: string; url: string; regimeName?: string }>
  ): Promise<SFG20Data> => {
    historyService.addEntry({
      type: "import",
      status: "in-progress",
      details: {
        regimes: shareLinks.length,
        source: "SFG20",
      },
    });

    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + shareLinks.length * 1000)
    );

    try {
      console.log("Fetching regime data...");

      // Just use the mock data directly — no duplication or mapping
      const importedRegimes: StepResult[] = mockStepResults.map((regime) => ({
        ...regime,
        shareLink: shareLinks[0] || null, // attach first link if needed
      }));

      const importedData: SFG20Data = {
        regimes: importedRegimes,
        totalCount: importedRegimes.length,
        lastImported: new Date().toISOString(),
      };

      // Save for demo
      localStorage.setItem("sfg20_data", JSON.stringify(importedData));

      const history = historyService.getHistory();
      const latestEntry = history[0];
      if (
        latestEntry &&
        latestEntry.type === "import" &&
        latestEntry.status === "in-progress"
      ) {
        const totalSchedules = importedRegimes.reduce(
          (sum, regime) => sum + regime.schedules.length,
          0
        );
        const totalTasks = importedRegimes.reduce(
          (sum, regime) =>
            sum +
            regime.schedules.reduce(
              (taskSum, schedule) => taskSum + schedule.tasks.length,
              0
            ),
          0
        );

        historyService.updateEntry(latestEntry.id, {
          status: "success",
          details: {
            regimes: importedRegimes.length,
            schedules: totalSchedules,
            tasks: totalTasks,
            source: "SFG20",
          },
        });
      }

      return importedData;
    } catch (error) {
      console.error("Failed to import regimes:", error);
      throw error;
    }
  },
  importData: async (
    accessToken: string,
    shareLinkId?: string
  ): Promise<SFG20Data> => {
    // If no share link provided, show error or use default behavior
    if (!shareLinkId) {
      throw new Error("Share link ID is required for SFG20 API v3.0");
    }

    return sfg20Service.importDataWithShareLinks(accessToken, [
      {
        id: shareLinkId,
        url: `https://facilities-iq.com/share/${shareLinkId}`,
      },
    ]);
  },

  getCachedData: (): SFG20Data | null => {
    if (typeof window === "undefined") return null;

    const cachedData = localStorage.getItem("sfg20_data");
    return cachedData ? JSON.parse(cachedData) : null;
  },

  hasImportedData: (): boolean => {
    return sfg20Service.getCachedData() !== null;
  },

  completeSharedTask: async (
    accessToken: string,
    shareLinkId: string,
    completions: Array<{
      taskId: string;
      completionDate: string;
      assetIndex?: number;
      metadata?: any;
    }>
  ): Promise<boolean> => {
    // Real implementation would make GraphQL mutation:
    // mutation completeSharedTask($accessToken: String!, $shareLinkId: String!, $completions: [TaskCompletion!]!)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(
      `Marking tasks complete for share link ${shareLinkId}:`,
      completions
    );
    return true;
  },

  recordTaskCompletions: async (
    accessToken: string,
    shareLinkId: string,
    completionData: {
      completedDateTime: string;
      scheduleID: string;
      visit: string;
      assetID: string;
      startedDateTime?: string;
      tasksCompleted?: Array<{
        taskID: string;
        completedDateTime: string;
        durationInMinutes?: number;
        startedDateTime?: string;
      }>;
      engineerID?: string;
      engineerName?: string;
      engineerNotes?: string;
      assetCondition?: string;
      otherInformation?: any;
    }
  ): Promise<boolean> => {
    // Real implementation would make GraphQL mutation:
    // mutation recordTaskCompletions($accessToken: String!, $shareLinkId: String!, ...)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(
      `Recording task completions for share link ${shareLinkId}:`,
      completionData
    );
    return true;
  },
};

// Legacy interface support for backward compatibility
export interface MaintenanceSchedule {
  id: string;
  name: string;
  description: string;
  frequency: string;
  category: string;
  version: string;
  lastUpdated: string;
  tasks: MaintenanceTask[];
}

export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  skillLevel: string;
  tools: string[];
  materials: string[];
}

// Helper function to convert new API structure to legacy format for backward compatibility
export function convertToLegacyFormat(data: SFG20Data): {
  schedules: MaintenanceSchedule[];
  totalCount: number;
  lastImported: string;
} {
  const legacySchedules: MaintenanceSchedule[] = [];

  data.regimes.forEach((regime) => {
    regime.schedules.forEach((schedule) => {
      const legacyTasks: MaintenanceTask[] = schedule.tasks.map((task) => ({
        id: task.id,
        name: task.title,
        description: task.content,
        estimatedDuration: task.minutes,
        skillLevel: task.skill.Skilling,
        tools: [], // Not directly available in new API
        materials: [], // Not directly available in new API
      }));

      legacySchedules.push({
        id: schedule.id,
        name: schedule.rawTitle,
        description: schedule.title,
        frequency:
          `${schedule.tasks[0]?.frequency.interval} ${schedule.tasks[0]?.frequency.period}` ||
          "Unknown",
        category: schedule.scheduleCategories[0] || "General",
        version: schedule.version,
        lastUpdated: schedule.modified,
        tasks: legacyTasks,
      });
    });
  });

  return {
    schedules: legacySchedules,
    totalCount: legacySchedules.length,
    lastImported: data.lastImported,
  };
}

export function initializeDemoData(): void {
  if (typeof window === "undefined") return;

  // Duplicate mockStepResults 3 times to simulate multiple regimes
  const demoRegimes = mockStepResults;

  const demoData: SFG20Data = {
    regimes: demoRegimes,
    totalCount: demoRegimes.length,
    lastImported: new Date().toISOString(),
  };

  // Store SFG20 data
  localStorage.setItem("sfg20_data", JSON.stringify(demoData));

  // Pre-selected schedules
  const selectedSchedules = demoRegimes.flatMap((regime) =>
    regime.schedules.map((schedule) => ({
      scheduleId: schedule.id,
      selectedTasks: schedule.tasks.map((task) => task.id),
      isFullSchedule: true,
    }))
  );

  const totalSelectedTasks = selectedSchedules.reduce(
    (sum, schedule) => sum + schedule.selectedTasks.length,
    0
  );

  const selectionState = {
    selectedSchedules,
    totalSelectedTasks,
    lastModified: new Date().toISOString(),
  };

  localStorage.setItem("sfg20_selection", JSON.stringify(selectionState));

  const totalSchedules = mockStepResults.reduce(
    (sum, regime) => sum + regime.schedules.length,
    0
  );
  const totalTasks = mockStepResults.reduce(
    (sum, regime) =>
      sum +
      regime.schedules.reduce(
        (taskSum, schedule) => taskSum + schedule.tasks.length,
        0
      ),
    0
  );

  historyService.addEntry({
    type: "import",
    status: "success",
    details: {
      regimes: mockStepResults.length,
      schedules: totalSchedules,
      tasks: totalTasks,
      source: "SFG20 Demo Data",
    },
  });

  console.log("[v0] Demo data initialized:", {
    regimes: demoData.regimes.length,
    schedules: selectedSchedules.length,
    tasks: totalSelectedTasks,
  });
}
