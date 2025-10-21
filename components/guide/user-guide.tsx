import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Settings,
  Upload,
  MapPin,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

interface UserGuideProps {
  onBack: () => void;
}

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: Info,
  },
  {
    id: "connect",
    title: "1. Connect Your Systems",
    icon: Settings,
  },
  {
    id: "import",
    title: "2. Import SFG20 Data",
    icon: Upload,
  },
  {
    id: "map",
    title: "3. Map to Simpro",
    icon: MapPin,
  },
  {
    id: "export",
    title: "4. Export & Schedule",
    icon: Download,
  },
];

export function UserGuide({ onBack }: UserGuideProps) {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">User Guide</h1>
              <p className="text-sm text-muted-foreground">
                SFG20 to Simpro Integration Documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-left">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-12 pr-4">
                {activeSection === "overview" && (
                  <section id="overview">
                    <h2 className="text-3xl font-semibold mb-4">
                      Getting Started
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      This guide will walk you through the complete process of
                      integrating SFG20 maintenance data with Simpro work order
                      management. The integration streamlines your maintenance
                      workflow by automatically syncing schedules, tasks, and
                      asset information.
                    </p>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          What You'll Learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">System Connection</p>
                            <p className="text-sm text-muted-foreground">
                              How to authenticate and connect both SFG20 and
                              Simpro systems
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Data Import</p>
                            <p className="text-sm text-muted-foreground">
                              Import maintenance regimes using SFG20 share links
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Field Mapping</p>
                            <p className="text-sm text-muted-foreground">
                              Map SFG20 fields to Simpro using pre-configured
                              templates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Export & Automation</p>
                            <p className="text-sm text-muted-foreground">
                              Set up automated synchronization for ongoing
                              updates
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Before You Begin
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Make sure you have admin access to both SFG20 and
                            Simpro systems. You'll need API credentials or
                            authentication tokens for both platforms.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSection === "connect" && (
                  <section id="connect">
                    <h2 className="text-3xl font-semibold mb-4">
                      Connect Your Systems
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      The first step is establishing connections to both SFG20
                      and Simpro. This creates a secure communication channel
                      for data transfer.
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Step 1: Connect to SFG20
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Navigate to the Settings page and select "SFG20
                          Connection". You'll need your SFG20 API credentials.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Required Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Share Link ID:</div>
                              <div className="col-span-2 text-muted-foreground">
                                From SFG20 share link
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mt-4 bg-muted rounded-lg p-4">
                          <p className="text-sm font-mono">
                            Settings → Integrations → SFG20 → Enter Credentials
                            → Test Connection
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Step 2: Connect to Simpro
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Similarly, configure your Simpro connection using your
                          Simpro API credentials.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Required Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Company URL:</div>
                              <div className="col-span-2 text-muted-foreground">
                                Your Simpro instance URL
                              </div>

                              <div className="font-medium">Access Token:</div>
                              <div className="col-span-2 text-muted-foreground">
                                From Simpro system settings
                              </div>

                              <div className="font-medium">Company ID:</div>
                              <div className="col-span-2 text-muted-foreground">
                                Your Simpro company identifier
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mt-4 bg-muted rounded-lg p-4">
                          <p className="text-sm font-mono">
                            Settings → Integrations → Simpro → Enter Credentials
                            → Test Connection
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                              Important
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Both connections must be successfully verified
                              before proceeding to the next step. Check that the
                              test connection succeeds for each system.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSection === "import" && (
                  <section id="import">
                    <h2 className="text-3xl font-semibold mb-4">
                      Import SFG20 Data
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Import your maintenance regimes from SFG20 using share
                      links. Each regime contains detailed maintenance
                      schedules, task lists, and asset information.
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Obtaining Share Links
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          In SFG20, navigate to your maintenance regime and
                          generate a share link. This link contains all the
                          necessary data for import.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              In SFG20
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ol className="space-y-2 text-sm list-decimal list-inside">
                              <li>Open your maintenance regime</li>
                              <li>Click "Share" or "Export"</li>
                              <li>Select "Generate Share Link"</li>
                              <li>Copy the generated URL</li>
                            </ol>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Import Process
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Once you have your share links, import them into the
                          integration platform.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Import Steps
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ol className="space-y-3 text-sm list-decimal list-inside">
                              <li>Navigate to "Import Data" section</li>
                              <li>Click "Add Share Link"</li>
                              <li>Paste the SFG20 share link</li>
                              <li>Click "Validate" to check the link</li>
                              <li>Review the regime details</li>
                              <li>Click "Import" to complete</li>
                            </ol>
                          </CardContent>
                        </Card>

                        <div className="mt-4 bg-muted rounded-lg p-4">
                          <p className="text-sm font-mono">
                            Import → Add Share Link → Paste URL → Validate →
                            Import
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          What Gets Imported
                        </h3>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Task Schedules
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Frequency, duration, and timing information
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Task Details
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Descriptions, procedures, and requirements
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Asset Information
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Asset types, locations, and specifications
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Compliance Data
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Regulatory requirements and standards
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </section>
                )}

                {activeSection === "map" && (
                  <section id="map">
                    <h2 className="text-3xl font-semibold mb-4">
                      Map to Simpro
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Map your SFG20 data to Simpro fields using pre-configured
                      templates. The system provides standardized mappings based
                      on task criticality levels.
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Template Selection
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose a mapping template based on the criticality of
                          your maintenance tasks.
                        </p>

                        <div className="grid gap-4">
                          <Card className="border-red-200 dark:border-red-900">
                            <CardHeader>
                              <CardTitle className="text-base text-red-600 dark:text-red-400">
                                Red (Critical)
                              </CardTitle>
                              <CardDescription>
                                High-priority tasks requiring immediate
                                attention and complete data transfer
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Includes all fields, priority scheduling, and full
                              compliance documentation
                            </CardContent>
                          </Card>

                          <Card className="border-amber-200 dark:border-amber-900">
                            <CardHeader>
                              <CardTitle className="text-base text-amber-600 dark:text-amber-400">
                                Amber (Important)
                              </CardTitle>
                              <CardDescription>
                                Standard maintenance tasks with essential data
                                fields
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Core fields including schedules, descriptions, and
                              basic compliance
                            </CardContent>
                          </Card>

                          <Card className="border-green-200 dark:border-green-900">
                            <CardHeader>
                              <CardTitle className="text-base text-green-600 dark:text-green-400">
                                Green (Routine)
                              </CardTitle>
                              <CardDescription>
                                Routine maintenance with minimal required data
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Basic scheduling and task information only
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Field Mappings
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          The following fields are automatically mapped between
                          systems:
                        </p>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4 text-sm pb-2 border-b">
                                <div className="font-semibold">SFG20 Field</div>
                                <div className="font-semibold text-center">
                                  →
                                </div>
                                <div className="font-semibold">
                                  Simpro Field
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                <div>Schedule - Raw Title</div>
                                <div className="text-center text-muted-foreground">
                                  →
                                </div>
                                <div>Asset Type/Name</div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                <div>Task Title</div>
                                <div className="text-center text-muted-foreground">
                                  →
                                </div>
                                <div>Task Name</div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                <div>Task - Content</div>
                                <div className="text-center text-muted-foreground">
                                  →
                                </div>
                                <div>Test Readings</div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                <div>Task - Classification</div>
                                <div className="text-center text-muted-foreground">
                                  →
                                </div>
                                <div>Priority Level</div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                <div>Skill - Skilling</div>
                                <div className="text-center text-muted-foreground">
                                  →
                                </div>
                                <div>Required Technician Level</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Review & Customize
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          After selecting a template, review the mappings and
                          select which data to include in the export.
                        </p>

                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm font-mono">
                            Map Data → Choose Template → Review Mappings →
                            Select Fields → Confirm
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSection === "export" && (
                  <section id="export">
                    <h2 className="text-3xl font-semibold mb-4">
                      Export & Schedule
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Export your mapped data to Simpro and set up automated
                      synchronization for ongoing updates.
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Manual Export
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Perform a one-time export of your maintenance data to
                          Simpro.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Export Process
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ol className="space-y-3 text-sm list-decimal list-inside">
                              <li>Navigate to the "Export" section</li>
                              <li>Review the mapped data summary</li>
                              <li>Click "Export to Simpro"</li>
                              <li>Monitor the export progress</li>
                              <li>Verify data in Simpro</li>
                            </ol>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Automated Synchronization
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Set up automatic syncing to keep your Simpro data
                          up-to-date with changes in SFG20.
                        </p>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Sync Options
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="font-medium text-sm mb-2">
                                Frequency
                              </p>
                              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                                <li>• Daily at specified time</li>
                                <li>• Weekly on selected day</li>
                                <li>• Monthly on specified date</li>
                                <li>• Manual trigger only</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-2">
                                Sync Scope
                              </p>
                              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                                <li>• New tasks only</li>
                                <li>• Updates to existing tasks</li>
                                <li>• All changes (full sync)</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mt-4 bg-muted rounded-lg p-4">
                          <p className="text-sm font-mono">
                            Export → Configure Sync → Set Schedule → Enable
                            Automation
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Monitoring & Logs
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          View export history and monitor sync status from the
                          dashboard.
                        </p>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Export History
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Complete log of all exports with timestamps
                                    and status
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Sync Status
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Real-time status of scheduled
                                    synchronizations
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Error Notifications
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Alerts for failed exports or sync issues
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                              Best Practice
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              Always verify the first export manually in Simpro
                              before enabling automated synchronization. This
                              ensures your field mappings are correct and data
                              is transferred as expected.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </div>
  );
}
