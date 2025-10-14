export interface HistoryEntry {
  id: string;
  type: "import" | "export";
  timestamp: string;
  status: "success" | "failed" | "in-progress";
  details: {
    regimes?: number;
    schedules?: number;
    tasks?: number;
    assets?: number;
    destination?: string;
    source?: string;
    errorMessage?: string;
  };
}

class HistoryService {
  private storageKey = "sfg20_history";

  getHistory(): HistoryEntry[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  addEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
    const history = this.getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    history.unshift(newEntry); // Add to beginning
    // Keep only last 100 entries
    const trimmedHistory = history.slice(0, 100);
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedHistory));
  }

  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }

  updateEntry(id: string, updates: Partial<HistoryEntry>): void {
    const history = this.getHistory();
    const index = history.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    }
  }

  initializeDemoHistory(): void {
    // Only initialize if no history exists
    const existingHistory = this.getHistory();
    if (existingHistory.length > 0) return;

    const now = new Date();
    const demoEntries: HistoryEntry[] = [
      {
        id: "demo_history_1",
        type: "export",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: "success",
        details: {
          regimes: 2,
          schedules: 5,
          tasks: 12,
          assets: 8,
          destination: "SimPro",
        },
      },
      {
        id: "demo_history_2",
        type: "import",
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        status: "success",
        details: {
          regimes: 3,
          schedules: 8,
          tasks: 24,
          source: "SFG20 API",
        },
      },
      {
        id: "demo_history_3",
        type: "export",
        timestamp: new Date(
          now.getTime() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
        status: "success",
        details: {
          regimes: 1,
          schedules: 3,
          tasks: 8,
          assets: 5,
          destination: "SimPro",
        },
      },
      {
        id: "demo_history_4",
        type: "export",
        timestamp: new Date(
          now.getTime() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(), // 5 days ago
        status: "failed",
        details: {
          regimes: 2,
          schedules: 4,
          tasks: 10,
          assets: 6,
          destination: "SimPro",
          errorMessage:
            "Connection timeout - please check your SimPro credentials",
        },
      },
      {
        id: "demo_history_5",
        type: "import",
        timestamp: new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 week ago
        status: "success",
        details: {
          regimes: 2,
          schedules: 6,
          tasks: 18,
          source: "SFG20 API",
        },
      },
      {
        id: "demo_history_6",
        type: "export",
        timestamp: new Date(
          now.getTime() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(), // 10 days ago
        status: "success",
        details: {
          regimes: 3,
          schedules: 7,
          tasks: 20,
          assets: 12,
          destination: "SimPro",
        },
      },
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(demoEntries));
  }
}

export const historyService = new HistoryService();
