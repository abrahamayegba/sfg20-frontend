"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Search, Filter, FileText, Tag, Info, Clock } from "lucide-react"
import type { SFG20Data } from "@/lib/sfg20-data"
import { SmartWordsDisplay } from "@/components/smart-words/smart-words-display"

interface RegimeManagerProps {
  data: SFG20Data
  onSelectRegime?: (regimeId: string) => void
  className?: string
}

export function RegimeManager({ data, onSelectRegime, className = "" }: RegimeManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegime, setSelectedRegime] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "schedules" | "tasks">("name")

  const filteredRegimes = data.regimes
    .filter(
      (regime) =>
        regime.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regime.schedules.some(
          (schedule) =>
            schedule.rawTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.tasks.some((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "schedules":
          return b.schedules.length - a.schedules.length
        case "tasks":
          const aTaskCount = a.schedules.reduce((sum, s) => sum + s.tasks.length, 0)
          const bTaskCount = b.schedules.reduce((sum, s) => sum + s.tasks.length, 0)
          return bTaskCount - aTaskCount
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleRegimeSelect = (regimeId: string) => {
    setSelectedRegime(regimeId === selectedRegime ? null : regimeId)
    if (onSelectRegime) {
      onSelectRegime(regimeId)
    }
  }

  const selectedRegimeData = selectedRegime ? data.regimes.find((r) => r.id === selectedRegime) : null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Controls */}
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
          <Select value={sortBy} onValueChange={(value: "name" | "schedules" | "tasks") => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="schedules">Schedule Count</SelectItem>
              <SelectItem value="tasks">Task Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">{data.regimes.length}</div>
            <div className="text-sm text-muted-foreground">Total Regimes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {data.regimes.reduce((sum, regime) => sum + regime.schedules.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Schedules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {data.regimes.reduce(
                (sum, regime) =>
                  sum + regime.schedules.reduce((scheduleSum, schedule) => scheduleSum + schedule.tasks.length, 0),
                0,
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
      </div>

      {/* Regimes List */}
      <div className="space-y-4">
        {filteredRegimes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No regimes found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms to find regimes.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRegimes.map((regime) => {
            const isSelected = selectedRegime === regime.id
            const taskCount = regime.schedules.reduce((sum, schedule) => sum + schedule.tasks.length, 0)
            const smartWordsCount = regime.schedules.reduce(
              (sum, schedule) => sum + schedule.tasks.filter((task) => task.linkId).length,
              0,
            )

            return (
              <Card
                key={regime.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected ? "ring-2 ring-accent/20 bg-accent/5" : "hover:shadow-md"
                }`}
                onClick={() => handleRegimeSelect(regime.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{regime.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span>Version {regime.version}</span>
                          <span>{regime.schedules.length} schedules</span>
                          <span>{taskCount} tasks</span>
                          {smartWordsCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {smartWordsCount} Smart Words
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">Regime ID: {regime.id}</Badge>
                  </div>
                </CardHeader>

                {/* Expanded Regime Details */}
                {isSelected && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          This regime contains {regime.schedules.length} maintenance schedules with {taskCount} total
                          tasks. {smartWordsCount > 0 && `${smartWordsCount} tasks include Smart Words integration.`}
                        </AlertDescription>
                      </Alert>

                      {/* Schedules in this Regime */}
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Schedules in this Regime
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {regime.schedules.map((schedule) => (
                            <div key={schedule.id} className="p-3 bg-muted/20 rounded-md border">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium text-sm text-foreground">{schedule.rawTitle}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {schedule.code}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {schedule.tasks.length} tasks
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {schedule.tasks.reduce((sum, task) => sum + task.minutes, 0)} min total
                                </div>
                              </div>

                              {/* Sample Tasks with Smart Words */}
                              {schedule.tasks.slice(0, 2).map((task) => (
                                <div
                                  key={task.id}
                                  className="mt-2 p-2 bg-background rounded border-l-2 border-accent/20"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-xs font-medium text-foreground">{task.title}</h6>
                                    <span className="text-xs text-muted-foreground">{task.minutes}min</span>
                                  </div>
                                  <SmartWordsDisplay task={task} className="mt-1" />
                                </div>
                              ))}

                              {schedule.tasks.length > 2 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  +{schedule.tasks.length - 2} more tasks...
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
