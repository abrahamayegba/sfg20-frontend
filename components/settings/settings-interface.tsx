"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Settings,
  Bell,
  Monitor,
  Download,
  Send as Sync,
  Save,
  RotateCcw,
  Upload,
  FileDown,
  CheckCircle,
  Info,
  UserIcon,
  Edit,
} from "lucide-react";
import { settingsService, type AppSettings } from "@/lib/settings";
import { authService } from "@/lib/auth";

interface SettingsInterfaceProps {
  onBack: () => void;
}

export function SettingsInterface({ onBack }: SettingsInterfaceProps) {
  const [settings, setSettings] = useState<AppSettings>(
    settingsService.getSettings()
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const user = authService.getCurrentUser();

  // --- DEMO PROFILE STATE (for first card) ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [profileData, setProfileData] = useState({
    name: user?.email ?? "Jane Doe",
    email: user?.email ?? "jane.doe@example.com",
  });

  useEffect(() => {
    const currentSettings = settingsService.getSettings();
    setSettings(currentSettings);
  }, []);

  const handleSettingChange = (path: string, value: any) => {
    const keys = path.split(".");
    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setSettings(newSettings);
    setHasChanges(true);
    setSaveStatus("idle");
  };

  const handleSave = () => {
    setSaveStatus("saving");
    try {
      settingsService.updateSettings(settings);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  const handleReset = () => {
    const defaultSettings = settingsService.resetSettings();
    setSettings(defaultSettings);
    setHasChanges(true);
    setSaveStatus("idle");
  };

  const handleExportSettings = () => {
    settingsService.exportSettings();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSettings = settingsService.importSettings(content);
        setSettings(importedSettings);
        setHasChanges(false);
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
      }
    };
    reader.readAsText(file);
  };

  const handleProfileSave = () => {
    setProfileStatus("saving");
    // fake async save
    setTimeout(() => {
      // here you could call an API to persist profileData
      setProfileStatus("saved");
      setIsEditingProfile(false);
      setTimeout(() => setProfileStatus("idle"), 1500);
    }, 700);
  };

  const handleProfileCancel = () => {
    // reset back to user or last "saved" values
    setProfileData({
      name: user?.email ?? "Jane Doe",
      email: user?.email ?? "jane.doe@example.com",
    });
    setIsEditingProfile(false);
    setProfileStatus("idle");
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileStatus("idle");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configure your SFG20 Data Manager preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Unsaved changes
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saveStatus === "saving"}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Save Status */}
        {saveStatus === "saved" && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Failed to save settings. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Manage your personal account details
                  </CardDescription>
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProfileEdit}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingProfile ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      onClick={handleProfileSave}
                      disabled={profileStatus === "saving"}
                    >
                      {profileStatus === "saving"
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleProfileCancel}>
                      Cancel
                    </Button>
                    {profileStatus === "saved" && (
                      <span className="text-xs text-green-600">
                        Profile updated
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profileData.name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profileData.email || "Not set"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your SFG20 account details and API configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    SFG20 Configuration
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {!user?.email
                      ? "••••••••••••••••" + user?.email.slice(-4)
                      : "Not configured"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="schedule-updates">Schedule Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when SFG20 schedules are updated with new
                      versions
                    </p>
                  </div>
                  <Switch
                    id="schedule-updates"
                    checked={settings.notifications.scheduleUpdates}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications.scheduleUpdates",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="export-complete">Export Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when data exports to Simpro complete
                    </p>
                  </div>
                  <Switch
                    id="export-complete"
                    checked={settings.notifications.exportComplete}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications.exportComplete",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="import-complete">Import Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when SFG20 data imports complete
                    </p>
                  </div>
                  <Switch
                    id="import-complete"
                    checked={settings.notifications.importComplete}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications.importComplete",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email (coming soon)
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications.emailNotifications",
                        checked
                      )
                    }
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Display Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance and layout of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.display.theme}
                    onValueChange={(value) =>
                      handleSettingChange("display.theme", value)
                    }
                  >
                    <SelectTrigger className=" w-[200px] border border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout to show more information
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={settings.display.compactMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("display.compactMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-task-details">Show Task Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically expand task details in the selection
                      interface
                    </p>
                  </div>
                  <Switch
                    id="show-task-details"
                    checked={settings.display.showTaskDetails}
                    onCheckedChange={(checked) =>
                      handleSettingChange("display.showTaskDetails", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Settings
              </CardTitle>
              <CardDescription>
                Configure default export behavior and formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-format">Default Export Format</Label>
                  <Select
                    value={settings.export.defaultFormat}
                    onValueChange={(value) =>
                      handleSettingChange("export.defaultFormat", value)
                    }
                  >
                    <SelectTrigger className=" w-[200px] border border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV (coming soon)</SelectItem>
                      <SelectItem value="xml">XML (coming soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-metadata">Include Metadata</Label>
                    <p className="text-sm text-muted-foreground">
                      Include export timestamps and version information in
                      exported files
                    </p>
                  </div>
                  <Switch
                    id="include-metadata"
                    checked={settings.export.includeMetadata}
                    onCheckedChange={(checked) =>
                      handleSettingChange("export.includeMetadata", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-download">Auto Download</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download export files after successful
                      export
                    </p>
                  </div>
                  <Switch
                    id="auto-download"
                    checked={settings.export.autoDownload}
                    onCheckedChange={(checked) =>
                      handleSettingChange("export.autoDownload", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sync className="h-5 w-5" />
                Sync Settings
              </CardTitle>
              <CardDescription>
                Configure automatic data synchronization with SFG20
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Automatic sync features are coming soon. Currently, you need
                  to manually import data from SFG20.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 opacity-50">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-import">Auto Import</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically check for and import new SFG20 data at
                      regular intervals
                    </p>
                  </div>
                  <Switch
                    id="auto-import"
                    checked={settings.sync.autoImport}
                    onCheckedChange={(checked) =>
                      handleSettingChange("sync.autoImport", checked)
                    }
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="import-interval">
                    Import Interval (hours)
                  </Label>
                  <Input
                    id="import-interval"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.sync.importInterval}
                    onChange={(e) =>
                      handleSettingChange(
                        "sync.importInterval",
                        Number.parseInt(e.target.value)
                      )
                    }
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Management */}
          <Card>
            <CardHeader>
              <CardTitle>Settings Management</CardTitle>
              <CardDescription>
                Export, import, or reset your application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleExportSettings}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                    id="import-settings"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("import-settings")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
