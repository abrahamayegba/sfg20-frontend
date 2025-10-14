"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Star,
  Clock,
  Tag,
  Settings,
  Copy,
} from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: "mapping" | "export" | "import"
  isDefault: boolean
  createdAt: string
  lastUsed?: string
  usageCount: number
  config: any
}

interface TemplatesManagerProps {
  onBack: () => void
}

export function TemplatesManager({ onBack }: TemplatesManagerProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "create" | "settings">("browse")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const templates: Template[] = [
    {
      id: "template_1",
      name: "Complete Building Maintenance",
      description: "Import all maintenance tasks (Red, Amber, Green) for comprehensive building maintenance coverage",
      category: "mapping",
      isDefault: true,
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
      usageCount: 45,
      config: {
        classifications: ["Red", "Amber", "Green"],
        includeAllFields: true,
      },
    },
    {
      id: "template_2",
      name: "Critical Tasks Only",
      description:
        "Import only Statutory & Mandatory (Red) and Business Critical (Amber) tasks for priority maintenance",
      category: "mapping",
      isDefault: true,
      createdAt: "2024-01-10",
      lastUsed: "2024-01-18",
      usageCount: 32,
      config: {
        classifications: ["Red", "Amber"],
      },
    },
    {
      id: "template_3",
      name: "Simpro Standard Export",
      description: "Standard export format optimized for Simpro job management system with all required fields",
      category: "export",
      isDefault: true,
      createdAt: "2024-01-05",
      lastUsed: "2024-01-19",
      usageCount: 67,
      config: {
        format: "json",
        includeMetadata: true,
        compression: false,
      },
    },
    {
      id: "template_4",
      name: "Quick Import Setup",
      description: "Fast import configuration for standard SFG20 share links with automatic regime detection",
      category: "import",
      isDefault: false,
      createdAt: "2024-01-12",
      lastUsed: "2024-01-17",
      usageCount: 23,
      config: {
        autoDetectRegimes: true,
        validateData: true,
        skipDuplicates: true,
      },
    },
    {
      id: "template_5",
      name: "Statutory Only",
      description: "Import only Statutory & Mandatory (Red) tasks - legally required maintenance",
      category: "mapping",
      isDefault: false,
      createdAt: "2024-01-08",
      lastUsed: "2024-01-16",
      usageCount: 18,
      config: {
        classifications: ["Red"],
      },
    },
    {
      id: "template_6",
      name: "Batch Export Large Datasets",
      description: "Optimized export template for large datasets with compression and batch processing",
      category: "export",
      isDefault: false,
      createdAt: "2024-01-03",
      usageCount: 12,
      config: {
        format: "json",
        compression: true,
        batchSize: 1000,
        includeProgressTracking: true,
      },
    },
  ]

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mapping":
        return "bg-blue-100 text-blue-800"
      case "export":
        return "bg-green-100 text-green-800"
      case "import":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUseTemplate = (template: Template) => {
    alert(
      `Using template: ${template.name}\n\nThis template will filter tasks by classification. Field mappings are pre-configured and standardized.`,
    )
  }

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setActiveTab("create")
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      // Simulate deletion
      alert("Template deleted successfully!")
    }
  }

  const handleDuplicateTemplate = (template: Template) => {
    alert(`Template "${template.name}" duplicated as "${template.name} (Copy)"`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Template Manager</h1>
                <p className="text-sm text-muted-foreground">Manage your mapping, import, and export templates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {templates.length} templates
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Templates</TabsTrigger>
            <TabsTrigger value="create">Create Template</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Browse Templates Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search templates by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Template
              </Button>
              <Button onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.name}
                          {template.isDefault && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                      <div className="text-sm text-muted-foreground">Used {template.usageCount} times</div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Created {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                      {template.lastUsed && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          Last used {new Date(template.lastUsed).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      {!template.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first template to get started"}
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Create Template Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : "Create New Template"}
                </CardTitle>
                <CardDescription>
                  {selectedTemplate
                    ? "Modify the existing template configuration"
                    : "Configure a new template for your workflow"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        placeholder="e.g., My Custom Mapping Template"
                        defaultValue={selectedTemplate?.name || ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-description">Description</Label>
                      <Input
                        id="template-description"
                        placeholder="Describe what this template does..."
                        defaultValue={selectedTemplate?.description || ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <select
                        id="template-category"
                        className="w-full p-2 border rounded-md"
                        defaultValue={selectedTemplate?.category || "mapping"}
                      >
                        <option value="mapping">Mapping Template</option>
                        <option value="export">Export Template</option>
                        <option value="import">Import Template</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Template Configuration</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Configure which tasks to include based on classification:
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Include Red (Statutory & Mandatory) tasks</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Include Amber (Business Critical) tasks</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Include Green (Recommended) tasks</span>
                        </label>
                        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
                          <strong>Note:</strong> Field mappings are pre-configured and cannot be customized. This
                          ensures data consistency.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(null)
                      setActiveTab("browse")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      alert(selectedTemplate ? "Template updated successfully!" : "Template created successfully!")
                      setSelectedTemplate(null)
                      setActiveTab("browse")
                    }}
                  >
                    {selectedTemplate ? "Update Template" : "Create Template"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Template Settings
                </CardTitle>
                <CardDescription>Configure global template preferences and defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-save templates</h4>
                      <p className="text-sm text-muted-foreground">Automatically save template configurations</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Template versioning</h4>
                      <p className="text-sm text-muted-foreground">Keep version history of template changes</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Share templates</h4>
                      <p className="text-sm text-muted-foreground">Allow templates to be shared with team members</p>
                    </div>
                    <input type="checkbox" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Template Storage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                      <div className="text-sm text-blue-700">Total Templates</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {templates.filter((t) => t.isDefault).length}
                      </div>
                      <div className="text-sm text-green-700">Default Templates</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {templates.filter((t) => !t.isDefault).length}
                      </div>
                      <div className="text-sm text-purple-700">Custom Templates</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Templates
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
