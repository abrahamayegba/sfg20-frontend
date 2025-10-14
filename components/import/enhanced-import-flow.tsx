"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Building,
  FileText,
  Zap,
} from "lucide-react"

interface EnhancedImportFlowProps {
  onBack: () => void
  onComplete: (data: any) => void
}

interface ShareLink {
  id: string
  url: string
  regimeName: string
  status: "pending" | "validating" | "valid" | "invalid" | "importing" | "completed" | "error"
  regimeData?: {
    id: string
    name: string
    version: string
    schedules: number
    tasks: number
    groups: number
  }
}

const demoRegimes = [
  {
    regimeName: "Main Building HVAC Maintenance",
    url: "https://facilities-iq.com/share/hvac-main-building-2024",
    regimeData: {
      id: "regime_hvac_001",
      name: "Main Building HVAC Maintenance",
      version: "2.1",
      schedules: 45,
      tasks: 320,
      groups: 12,
    },
  },
  {
    regimeName: "Fire Safety Systems",
    url: "https://facilities-iq.com/share/fire-safety-systems-2024",
    regimeData: {
      id: "regime_fire_001",
      name: "Fire Safety Systems",
      version: "1.8",
      schedules: 28,
      tasks: 180,
      groups: 8,
    },
  },
  {
    regimeName: "Electrical Infrastructure",
    url: "https://facilities-iq.com/share/electrical-infra-2024",
    regimeData: {
      id: "regime_elec_001",
      name: "Electrical Infrastructure",
      version: "2.0",
      schedules: 35,
      tasks: 250,
      groups: 10,
    },
  },
  {
    regimeName: "Plumbing & Water Systems",
    url: "https://facilities-iq.com/share/plumbing-water-2024",
    regimeData: {
      id: "regime_plumb_001",
      name: "Plumbing & Water Systems",
      version: "1.9",
      schedules: 22,
      tasks: 165,
      groups: 6,
    },
  },
]

export function EnhancedImportFlow({ onBack, onComplete }: EnhancedImportFlowProps) {
  const [currentStep, setCurrentStep] = useState<"setup" | "validate" | "import" | "results">("setup")
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([{ id: "1", url: "", regimeName: "", status: "pending" }])
  const [importType, setImportType] = useState<"full" | "updates">("full")
  const [hasExistingData, setHasExistingData] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [currentImporting, setCurrentImporting] = useState("")
  const [importResults, setImportResults] = useState<{
    totalRegimes: number
    totalSchedules: number
    totalTasks: number
    totalGroups: number
    successfulImports: number
    failedImports: number
    duration: string
  } | null>(null)

  useEffect(() => {
    // Check if user has existing imported data
    const existingData = localStorage.getItem("sfg20_imported_data")
    setHasExistingData(!!existingData)
  }, [])

  const populateWithDemoData = (count = 2) => {
    const selectedRegimes = demoRegimes.slice(0, count)
    const newShareLinks = selectedRegimes.map((regime, index) => ({
      id: (index + 1).toString(),
      url: regime.url,
      regimeName: regime.regimeName,
      status: "pending" as const,
      regimeData: regime.regimeData,
    }))
    setShareLinks(newShareLinks)
  }

  const addShareLink = () => {
    const newId = (shareLinks.length + 1).toString()
    setShareLinks([...shareLinks, { id: newId, url: "", regimeName: "", status: "pending" }])
  }

  const removeShareLink = (id: string) => {
    if (shareLinks.length > 1) {
      setShareLinks(shareLinks.filter((link) => link.id !== id))
    }
  }

  const updateShareLink = (id: string, field: "url" | "regimeName", value: string) => {
    setShareLinks(shareLinks.map((link) => (link.id === id ? { ...link, [field]: value, status: "pending" } : link)))
  }

  const populateShareLinkDemo = (id: string) => {
    const availableRegimes = demoRegimes.filter(
      (regime) => !shareLinks.some((link) => link.regimeName === regime.regimeName && link.id !== id),
    )

    if (availableRegimes.length > 0) {
      const randomRegime = availableRegimes[Math.floor(Math.random() * availableRegimes.length)]
      setShareLinks(
        shareLinks.map((link) =>
          link.id === id
            ? { ...link, url: randomRegime.url, regimeName: randomRegime.regimeName, status: "pending" }
            : link,
        ),
      )
    }
  }

  const validateShareLinks = async () => {
    setCurrentStep("validate")

    for (const link of shareLinks) {
      if (!link.url || !link.regimeName) continue

      // Update status to validating
      setShareLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, status: "validating" as const } : l)))

      // Simulate API validation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation result - higher success rate for demo data
      const isDemoData = demoRegimes.some((regime) => regime.url === link.url)
      const isValid = isDemoData ? true : Math.random() > 0.2

      if (isValid) {
        const mockRegimeData = link.regimeData || {
          id: `regime_${link.id}`,
          name: link.regimeName,
          version: "2.1",
          schedules: Math.floor(Math.random() * 50) + 10,
          tasks: Math.floor(Math.random() * 500) + 100,
          groups: Math.floor(Math.random() * 20) + 5,
        }

        setShareLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, status: "valid" as const, regimeData: mockRegimeData } : l)),
        )
      } else {
        setShareLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, status: "invalid" as const } : l)))
      }
    }
  }

  const startImport = async () => {
    setCurrentStep("import")
    setImportProgress(0)

    const validLinks = shareLinks.filter((link) => link.status === "valid")
    const totalSteps = validLinks.length
    let completedSteps = 0
    let totalRegimes = 0
    let totalSchedules = 0
    let totalTasks = 0
    let totalGroups = 0
    let successfulImports = 0
    let failedImports = 0

    const startTime = Date.now()

    for (const link of validLinks) {
      setCurrentImporting(`Importing ${link.regimeName}...`)
      setShareLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, status: "importing" as const } : l)))

      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const success = Math.random() > 0.1 // 90% success rate for demo

      if (success && link.regimeData) {
        totalRegimes++
        totalSchedules += link.regimeData.schedules
        totalTasks += link.regimeData.tasks
        totalGroups += link.regimeData.groups
        successfulImports++

        setShareLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, status: "completed" as const } : l)))
      } else {
        failedImports++
        setShareLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, status: "error" as const } : l)))
      }

      completedSteps++
      setImportProgress((completedSteps / totalSteps) * 100)
    }

    const endTime = Date.now()
    const duration = `${Math.round((endTime - startTime) / 1000)}s`

    const results = {
      totalRegimes,
      totalSchedules,
      totalTasks,
      totalGroups,
      successfulImports,
      failedImports,
      duration,
    }

    setImportResults(results)

    const importedData = {
      regimes: validLinks.filter((link) => link.status === "completed").map((link) => link.regimeData),
      importDate: new Date().toISOString(),
      stats: results,
    }
    localStorage.setItem("sfg20_imported_data", JSON.stringify(importedData))

    setCurrentStep("results")
    setCurrentImporting("")
  }

  const getStatusIcon = (status: ShareLink["status"]) => {
    switch (status) {
      case "valid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "invalid":
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "validating":
      case "importing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ShareLink["status"]) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "invalid":
        return <Badge variant="destructive">Invalid</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "validating":
        return <Badge variant="outline">Validating...</Badge>
      case "importing":
        return <Badge variant="outline">Importing...</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const canProceedToValidation = shareLinks.some((link) => link.url && link.regimeName)
  const canProceedToImport = shareLinks.some((link) => link.status === "valid")
  const allValidated = shareLinks.every((link) => !link.url || link.status === "valid" || link.status === "invalid")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Import from SFG20</h1>
            <p className="text-sm text-muted-foreground">Import maintenance regimes from your SFG20 account</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {["Setup", "Validate", "Import", "Results"].map((step, index) => {
              const stepKey = step.toLowerCase() as "setup" | "validate" | "import" | "results"
              const isActive = currentStep === stepKey
              const isCompleted =
                (currentStep === "validate" && stepKey === "setup") ||
                (currentStep === "import" && ["setup", "validate"].includes(stepKey)) ||
                (currentStep === "results" && ["setup", "validate", "import"].includes(stepKey))

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
                  {index < 3 && <div className="w-16 h-px bg-border mx-4" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Setup Step */}
        {currentStep === "setup" && (
          <div className="space-y-6">
            {/* Import Type Selection */}
            {hasExistingData && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Type</CardTitle>
                  <CardDescription>Choose whether to perform a full import or import updates only</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={importType} onValueChange={(value) => setImportType(value as "full" | "updates")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="flex-1">
                        <div>
                          <div className="font-medium">Full Import</div>
                          <div className="text-sm text-muted-foreground">
                            Replace all existing data with fresh import from SFG20
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="updates" id="updates" />
                      <Label htmlFor="updates" className="flex-1">
                        <div>
                          <div className="font-medium">Updates Only</div>
                          <div className="text-sm text-muted-foreground">
                            Import only changes since your last import
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Share Links Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Share Links
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => populateWithDemoData(2)}>
                      2 Demo Regimes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => populateWithDemoData(4)}>
                      4 Demo Regimes
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Add the share links for each regime you want to import from SFG20 Facilities-iQ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shareLinks.map((link, index) => (
                  <div key={link.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Regime {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => populateShareLinkDemo(link.id)}>
                          Demo
                        </Button>
                        {getStatusIcon(link.status)}
                        {shareLinks.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeShareLink(link.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`regime-name-${link.id}`}>Regime Name</Label>
                        <Input
                          id={`regime-name-${link.id}`}
                          placeholder="e.g., Main Building Maintenance"
                          value={link.regimeName}
                          onChange={(e) => updateShareLink(link.id, "regimeName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`share-link-${link.id}`}>Share Link URL</Label>
                        <Input
                          id={`share-link-${link.id}`}
                          placeholder="https://facilities-iq.com/share/..."
                          value={link.url}
                          onChange={(e) => updateShareLink(link.id, "url", e.target.value)}
                        />
                      </div>
                    </div>

                    {link.status !== "pending" && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">Status</div>
                        {getStatusBadge(link.status)}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={addShareLink} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Regime
                </Button>

                <div className="flex justify-end pt-4">
                  <Button onClick={validateShareLinks} disabled={!canProceedToValidation}>
                    Validate Share Links
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Validate Step */}
        {currentStep === "validate" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
                <CardDescription>Checking your share links and regime accessibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shareLinks
                  .filter((link) => link.url && link.regimeName)
                  .map((link) => (
                    <div key={link.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{link.regimeName}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(link.status)}
                          {getStatusBadge(link.status)}
                        </div>
                      </div>

                      {link.regimeData && link.status === "valid" && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="p-2 bg-muted rounded">
                            <div className="text-lg font-bold text-accent">{link.regimeData.schedules}</div>
                            <div className="text-xs text-muted-foreground">Schedules</div>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <div className="text-lg font-bold text-accent">{link.regimeData.tasks}</div>
                            <div className="text-xs text-muted-foreground">Tasks</div>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <div className="text-lg font-bold text-accent">{link.regimeData.groups}</div>
                            <div className="text-xs text-muted-foreground">Groups</div>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <div className="text-sm font-medium">v{link.regimeData.version}</div>
                            <div className="text-xs text-muted-foreground">Version</div>
                          </div>
                        </div>
                      )}

                      {link.status === "invalid" && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          Unable to access this regime. Please check the share link URL and ensure it's shared with your
                          domain.
                        </div>
                      )}
                    </div>
                  ))}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("setup")}>
                    Back to Setup
                  </Button>
                  {allValidated && (
                    <Button onClick={startImport} disabled={!canProceedToImport}>
                      Start Import
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Import Step */}
        {currentStep === "import" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Importing Data</CardTitle>
                <CardDescription>Importing maintenance regimes from SFG20</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  {currentImporting && <p className="text-sm text-muted-foreground">{currentImporting}</p>}
                </div>

                <div className="space-y-3">
                  {shareLinks
                    .filter((link) => link.status !== "pending" && link.status !== "invalid")
                    .map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(link.status)}
                          <span className="font-medium">{link.regimeName}</span>
                        </div>
                        {getStatusBadge(link.status)}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && importResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Import Complete
                </CardTitle>
                <CardDescription>Your SFG20 data has been successfully imported</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Success Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResults.successfulImports}</div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResults.failedImports}</div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResults.totalRegimes}</div>
                    <div className="text-sm text-blue-700">Regimes</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{importResults.duration}</div>
                    <div className="text-sm text-purple-700">Duration</div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-accent" />
                      <span className="font-medium">Schedules</span>
                    </div>
                    <div className="text-2xl font-bold text-accent">{importResults.totalSchedules}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="font-medium">Tasks</span>
                    </div>
                    <div className="text-2xl font-bold text-accent">{importResults.totalTasks}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-accent" />
                      <span className="font-medium">Groups</span>
                    </div>
                    <div className="text-2xl font-bold text-accent">{importResults.totalGroups}</div>
                  </div>
                </div>

                {/* Individual Regime Results */}
                <div className="space-y-3">
                  <h4 className="font-medium">Import Details</h4>
                  {shareLinks
                    .filter((link) => link.status === "completed" || link.status === "error")
                    .map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(link.status)}
                          <div>
                            <div className="font-medium">{link.regimeName}</div>
                            {link.regimeData && link.status === "completed" && (
                              <div className="text-sm text-muted-foreground">
                                {link.regimeData.schedules} schedules • {link.regimeData.tasks} tasks
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(link.status)}
                      </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => onComplete(importResults)}>
                    Continue to Mapping
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
