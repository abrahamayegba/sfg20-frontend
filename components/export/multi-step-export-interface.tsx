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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  Package,
  ClipboardCheck,
  ListChecks,
  Shield,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react";
import {
  exportService,
  type MultiStepExportState,
  type ExportStep,
  type CustomField,
  type SimproTestReading,
} from "@/lib/export-service";
import { initializeDemoData } from "@/lib/sfg20-data";

interface MultiStepExportInterfaceProps {
  onBackToSelection: () => void;
  onBackToDashboard: () => void;
}

export function MultiStepExportInterface({
  onBackToSelection,
  onBackToDashboard,
}: MultiStepExportInterfaceProps) {
  const [exportState, setExportState] = useState<MultiStepExportState | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Custom field form state
  const [newCustomField, setNewCustomField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  });

  // Test reading form state
  const [newTestReading, setNewTestReading] = useState<
    Partial<SimproTestReading>
  >({
    name: "",
    description: "",
    readingType: "Pass/Fail",
    frequency: "Monthly",
    isFailurePoint: true,
    alertOnFailure: true,
  });

  useEffect(() => {
    const state = exportService.initializeMultiStepExport();
    if (!state) {
      console.log("[v0] No export state found, initializing demo data");
      initializeDemoData();
      const retryState = exportService.initializeMultiStepExport();
      setExportState(retryState);
    } else {
      setExportState(state);
    }
  }, []);

  const handleStartExport = async () => {
    if (!exportState) return;

    setIsExporting(true);
    setCurrentStep(4);

    try {
      const updatedState = await exportService.executeMultiStepExport(
        exportState,
        (state) => {
          setExportState({ ...state });
        }
      );
      setExportState(updatedState);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRetryStep = async (stepId: string) => {
    if (!exportState) return;

    try {
      const updatedState = await exportService.retryExportStep(
        exportState,
        stepId
      );
      setExportState(updatedState);
    } catch (error) {
      console.error("Retry failed:", error);
    }
  };

  const handleAddCustomField = () => {
    if (!exportState || !newCustomField.name) return;

    const field: CustomField = {
      id: `cf_${Date.now()}`,
      name: newCustomField.name,
      type: newCustomField.type || "text",
      required: newCustomField.required || false,
      options: newCustomField.options,
      defaultValue: newCustomField.defaultValue,
    };

    const updatedState = exportService.addCustomField(exportState, field);
    setExportState(updatedState);
    setNewCustomField({ name: "", type: "text", required: false });
  };

  const handleRemoveCustomField = (fieldId: string) => {
    if (!exportState) return;
    const updatedState = exportService.removeCustomField(exportState, fieldId);
    setExportState(updatedState);
  };

  const handleAddTestReading = () => {
    if (!exportState || !newTestReading.name || !newTestReading.assetId) return;

    const reading: SimproTestReading = {
      id: `tr_${Date.now()}`,
      assetId: newTestReading.assetId,
      name: newTestReading.name,
      description: newTestReading.description || "",
      readingType: newTestReading.readingType || "Pass/Fail",
      expectedValue: newTestReading.expectedValue,
      unit: newTestReading.unit,
      frequency: newTestReading.frequency || "Monthly",
      isFailurePoint: newTestReading.isFailurePoint ?? true,
      alertOnFailure: newTestReading.alertOnFailure ?? true,
    };

    const updatedState = exportService.addTestReading(exportState, reading);
    setExportState(updatedState);
    setNewTestReading({
      name: "",
      description: "",
      readingType: "Pass/Fail",
      frequency: "Monthly",
      isFailurePoint: true,
      alertOnFailure: true,
    });
  };

  const handleRemoveTestReading = (readingId: string) => {
    if (!exportState) return;
    const updatedState = exportService.removeTestReading(
      exportState,
      readingId
    );
    setExportState(updatedState);
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "validation":
        return Shield;
      case "service-levels":
        return Database;
      case "assets":
        return Package;
      case "test-readings":
        return ClipboardCheck;
      case "tasks":
        return ListChecks;
      case "verification":
        return CheckCircle;
      default:
        return CheckCircle;
    }
  };

  const getStatusColor = (status: ExportStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!exportState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">No Data Selected</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please select maintenance schedules and tasks first.
            </p>
            <Button onClick={onBackToSelection}>Back to Selection</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Export to simPRO
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure and export your SFG20 data to simPRO
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onBackToSelection}
                disabled={isExporting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {exportState.overallStatus === "completed" && (
                <Button onClick={onBackToDashboard}>Dashboard</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Test Readings", icon: ClipboardCheck },
              { num: 2, label: "Custom Fields", icon: Plus },
              { num: 3, label: "Review", icon: FileCheck },
              { num: 4, label: "Export", icon: CheckCircle },
            ].map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted =
                currentStep > step.num ||
                exportState.overallStatus === "completed";

              return (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-background border-gray-300 text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium text-center">
                      {step.label}
                    </div>
                  </div>
                  {index < 3 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Configure Test Readings</CardTitle>
              <CardDescription>
                Set up test readings and failure points that will be monitored
                in simPRO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Test Reading Form */}
              <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Test Reading
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reading Name *</Label>
                    <Input
                      placeholder="e.g., Temperature Check"
                      value={newTestReading.name}
                      onChange={(e) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset *</Label>
                    <Select
                      value={newTestReading.assetId}
                      onValueChange={(value) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          assetId: value,
                        }))
                      }
                    >
                      <SelectTrigger className=" w-full border border-gray-200">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {exportState.assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reading Type</Label>
                    <Select
                      value={newTestReading.readingType}
                      onValueChange={(value) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          readingType: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className=" w-full border border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass/Fail">Pass/Fail</SelectItem>
                        <SelectItem value="Numeric">Numeric</SelectItem>
                        <SelectItem value="Text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={newTestReading.frequency}
                      onValueChange={(value) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          frequency: value,
                        }))
                      }
                    >
                      <SelectTrigger className=" w-full border border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Optional description"
                      value={newTestReading.description}
                      onChange={(e) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFailurePoint"
                      checked={newTestReading.isFailurePoint}
                      onCheckedChange={(checked) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          isFailurePoint: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="isFailurePoint"
                      className="font-normal cursor-pointer"
                    >
                      Mark as failure point
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alertOnFailure"
                      checked={newTestReading.alertOnFailure}
                      onCheckedChange={(checked) =>
                        setNewTestReading((prev) => ({
                          ...prev,
                          alertOnFailure: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="alertOnFailure"
                      className="font-normal cursor-pointer"
                    >
                      Send alert on failure
                    </Label>
                  </div>
                </div>
                <Button
                  onClick={handleAddTestReading}
                  disabled={!newTestReading.name || !newTestReading.assetId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Reading
                </Button>
              </div>

              {/* Test Readings List */}
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Configured Test Readings ({exportState.testReadings.length})
                </h3>
                {exportState.testReadings.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No test readings configured yet. Add at least one test
                      reading to continue.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {exportState.testReadings.map((reading) => {
                      const asset = exportState.assets.find(
                        (a) => a.id === reading.assetId
                      );
                      return (
                        <div
                          key={reading.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{reading.name}</div>
                              {reading.isFailurePoint && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Failure Point
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Asset: {asset?.name || "Unknown"} •{" "}
                              {reading.readingType} • {reading.frequency}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTestReading(reading.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBackToSelection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Selection
                </Button>
                <Button onClick={() => setCurrentStep(2)}>
                  Next: Custom Fields
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Configure Custom Fields (Optional)</CardTitle>
              <CardDescription>
                Add custom fields to include additional data in your simPRO
                export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Custom Field Form */}
              <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Custom Field
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      placeholder="e.g., Warranty Expiry"
                      value={newCustomField.name}
                      onChange={(e) =>
                        setNewCustomField((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select
                      value={newCustomField.type}
                      onValueChange={(value) =>
                        setNewCustomField((prev) => ({
                          ...prev,
                          type: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className=" w-full border border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Yes/No</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="required"
                      checked={newCustomField.required}
                      onCheckedChange={(checked) =>
                        setNewCustomField((prev) => ({
                          ...prev,
                          required: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="required"
                      className="font-normal cursor-pointer"
                    >
                      Required field
                    </Label>
                  </div>
                </div>
                <Button
                  onClick={handleAddCustomField}
                  disabled={!newCustomField.name}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {/* Custom Fields List */}
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Configured Custom Fields ({exportState.customFields.length})
                </h3>
                {exportState.customFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No custom fields configured. You can skip this step if you
                    don't need additional fields.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {exportState.customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{field.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Type: {field.type} {field.required && "• Required"}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCustomField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next: Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Review Export Configuration</CardTitle>
                <CardDescription>
                  Review your configuration before starting the export to simPRO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {exportState.serviceLevels.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Service Levels
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {exportState.assets.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Assets
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {exportState.testReadings.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Test Readings
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {exportState.tasks.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Configuration Summary */}
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      Test Readings Summary
                    </h3>
                    <div className="space-y-2">
                      {exportState.testReadings.slice(0, 3).map((reading) => {
                        const asset = exportState.assets.find(
                          (a) => a.id === reading.assetId
                        );
                        return (
                          <div
                            key={reading.id}
                            className="text-sm flex items-center justify-between"
                          >
                            <span>{reading.name}</span>
                            <span>{asset?.name || "Unknown"}</span>
                            {reading.isFailurePoint && (
                              <Badge variant="destructive" className="text-xs">
                                Failure Point
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                      {exportState.testReadings.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{exportState.testReadings.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>

                  {exportState.customFields.length > 0 && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Custom Fields Summary
                      </h3>
                      <div className="space-y-2">
                        {exportState.customFields.map((field) => (
                          <div
                            key={field.id}
                            className="text-sm flex items-center justify-between"
                          >
                            <span>{field.name}</span>
                            <span className="text-muted-foreground">
                              {field.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ready to export! Click "Start Export" to begin transferring
                    your data to simPRO.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleStartExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Starting Export...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Start Export to simPRO
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Export Progress</CardTitle>
              <CardDescription>
                Tracking the export process to simPRO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Status Alert */}
              {exportState.overallStatus !== "not-started" && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border text-[15px] ${
                    exportState.overallStatus === "completed"
                      ? "border-green-200 bg-green-50"
                      : exportState.overallStatus === "failed"
                      ? "border-red-200 bg-red-50"
                      : exportState.overallStatus === "partial"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  {exportState.overallStatus === "completed" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold text-green-800">
                        Export Complete! Your data has been successfully
                        exported to simPRO.
                      </span>
                    </>
                  )}

                  {exportState.overallStatus === "in-progress" && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-blue-800">
                        Export in Progress... Please wait while we transfer your
                        data.
                      </span>
                    </>
                  )}

                  {exportState.overallStatus === "failed" && (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <span className="font-semibold text-red-800">
                        Export Failed. Please review the errors below and retry.
                      </span>
                    </>
                  )}

                  {exportState.overallStatus === "partial" && (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <span className="font-semibold text-yellow-800">
                        Export Partially Complete. Some steps failed.
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Export Steps Progress */}
              <div className="space-y-4">
                {exportState.steps.map((step, index) => {
                  const StepIcon = getStepIcon(step.id);
                  return (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg border ${getStatusColor(
                              step.status
                            )}`}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {step.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {step.status === "completed" && (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                          {step.status === "in-progress" && (
                            <Badge
                              variant="default"
                              className="bg-blue-100 text-blue-800"
                            >
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              In Progress
                            </Badge>
                          )}
                          {step.status === "failed" && (
                            <>
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                              {step.retryCount < step.maxRetries && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetryStep(step.id)}
                                >
                                  <Loader2 className="h-3 w-3 mr-1" />
                                  Retry ({step.retryCount}/{step.maxRetries})
                                </Button>
                              )}
                            </>
                          )}
                          {step.status === "pending" && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                      {(step.status === "in-progress" ||
                        step.status === "completed") && (
                        <Progress value={step.progress} className="h-2" />
                      )}
                      {step.error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800 text-sm">
                            {step.error}
                          </AlertDescription>
                        </Alert>
                      )}
                      {index < exportState.steps.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>

              {/* Completion Actions */}
              {exportState.overallStatus === "completed" && (
                <div className="flex justify-center gap-3 pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Start New Export
                  </Button>
                  <Button onClick={onBackToDashboard}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
