"use client";

import { useState, useEffect } from "react";
import {
  sfg20Service,
  type SFG20Data,
  initializeDemoData,
} from "@/lib/sfg20-data";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { ConnectionsManager } from "@/components/connections/connections-manager";
import { MultiStepExportInterface } from "@/components/export/multi-step-export-interface";
import { SettingsInterface } from "@/components/settings/settings-interface";
import { EnhancedImportFlow } from "@/components/import/enhanced-import-flow";
import { SimplifiedMappingInterface } from "@/components/mapping/simplified-mapping-interface";
import { UserGuide } from "@/components/guide/user-guide";
import { TemplatesManager } from "@/components/templates/templates-manager";
import { HistoryInterface } from "../history/history-interface";
import { historyService } from "@/lib/history-service";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<
    | "main"
    | "connections"
    | "import"
    | "mapping"
    | "export"
    | "templates"
    | "guide"
    | "settings"
    | "history"
  >(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("current_view");
      return (savedView as any) || "main";
    }
    return "main";
  });

  const [importedData, setImportedData] = useState<SFG20Data | null>(null);
  const [connectionStatus, setConnectionStatus] = useState({
    sfg20: false,
    simpro: false,
  });

  useEffect(() => {
    const sfg20Config = localStorage.getItem("sfg20_config");
    const simproConfig = localStorage.getItem("simpro_config");

    setConnectionStatus({
      sfg20: !!sfg20Config,
      simpro: !!simproConfig,
    });
  }, []);

  useEffect(() => {
    // Only run demo initialization if SFG20 is connected
    if (connectionStatus.sfg20) {
      const cachedData = sfg20Service.getCachedData();
      if (!cachedData) {
        console.log("[v0] No SFG20 data found, initializing demo data");
        initializeDemoData();
        historyService.initializeDemoHistory();
        // Reload cached data after initialization
        const newCachedData = sfg20Service.getCachedData();
        setImportedData(newCachedData);
      } else {
        setImportedData(cachedData);
      }
    }
  }, [connectionStatus.sfg20]); // dependency on connection status

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("current_view", currentView);
    }
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
  };

  const importStats = importedData
    ? {
        regimes: importedData.regimes?.length || 0,
        schedules:
          importedData.regimes?.reduce(
            (sum, regime) => sum + (regime.schedules?.length || 0),
            0
          ) || 0,
        tasks:
          importedData.regimes?.reduce(
            (sum, regime) =>
              sum +
              (regime.schedules?.reduce(
                (scheduleSum, schedule) =>
                  scheduleSum + (schedule.tasks?.length || 0),
                0
              ) || 0),
            0
          ) || 0,
        lastImport: importedData.lastImported,
      }
    : undefined;

  // Route to different views
  switch (currentView) {
    case "connections":
      return <ConnectionsManager onBack={() => setCurrentView("main")} />;

    case "import":
      return (
        <EnhancedImportFlow
          onBack={() => setCurrentView("main")}
          onComplete={(data) => {
            setImportedData(data);
            setCurrentView("mapping");
          }}
        />
      );

    case "mapping":
      return (
        <SimplifiedMappingInterface
          onBack={() => setCurrentView("main")}
          onContinue={() => setCurrentView("export")}
        />
      );

    case "export":
      return (
        <MultiStepExportInterface
          onBackToSelection={() => setCurrentView("mapping")}
          onBackToDashboard={() => setCurrentView("main")}
        />
      );

    case "settings":
      return <SettingsInterface onBack={() => setCurrentView("main")} />;

    case "guide":
      return <UserGuide onBack={() => setCurrentView("main")} />;

    case "templates":
      return <TemplatesManager onBack={() => setCurrentView("main")} />;

    case "history": // Added history view case
      return <HistoryInterface onBack={() => setCurrentView("main")} />;
  }

  // Main navigation view
  return (
    <MainNavigation
      onLogout={onLogout}
      onNavigate={handleNavigate}
      connectionStatus={connectionStatus}
      importStats={importStats}
    />
  );
}
