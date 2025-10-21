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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Database,
  Building,
  FileText,
  Zap,
  CheckCircle,
  Eye,
  Save,
  Download,
  Target,
  Loader2,
  Info,
  AlertCircle,
  ChevronDown,
  Layers,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Task {
  id: string;
  title: string;
  classification: string;
  frequencyChange: any;
  intervalInHours: number;
  where: string;
  minutes: number;
  skill: any;
  content: string;
  linkId: string;
}

interface Schedule {
  id: string;
  code: string;
  title: string;
  rawTitle: string;
  tasks: Task[];
}

interface Regime {
  id: string;
  name: string;
  version: string;
  schedules: Schedule[];
}

interface SimplifiedMappingInterfaceProps {
  onBack: () => void;
  onContinue: () => void;
}

export function SimplifiedMappingInterface({         
  onBack,
  onContinue,
}: SimplifiedMappingInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<
    "overview" | "selection" | "preview"
  >("overview");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedRegimes, setSelectedRegimes] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [mappingProgress, setMappingProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showAllMappings, setShowAllMappings] = useState(false);
  const [expandedTaskLists, setExpandedTaskLists] = useState<
    Record<string, boolean>
  >({});

  // Mock data - in real app this would come from imported SFG20 data
  const mockRegimes: Regime[] = [
    {
      id: "regime_1",
      name: "Region 1 - Regime",
      version: "2",
      schedules: [
        {
          id: "schedule_1",
          code: "05-38-0018",
          title: "Royal Infirmary - Facility - Biomass Boiler",
          rawTitle: "Biomass Boiler",
          tasks: [
            {
              id: "task_1",
              title:
                "Formal Visual Inspection of in-service electrical equipment",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 730,
              where: "Royal Infirmary - Facility",
              minutes: 5,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Confirm inspection frequency with a risk assessment considering environment, usage rate, equipment condition/age...",
              linkId: "fight reason tell",
            },
            {
              id: "task_2",
              title:
                "Combined Inspection and Testing of in-service electrical equipment",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 1460,
              where: "Royal Infirmary - Facility",
              minutes: 4,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Before combined inspection and testing, inform equipment user of downtime...",
              linkId: "shade defend envelope",
            },
            {
              id: "task_3",
              title: "User checks",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 24,
              where: "Royal Infirmary - Facility",
              minutes: 0.25,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content: "Perform daily user checks on equipment...",
              linkId: "user daily check",
            },
            {
              id: "task_4",
              title: "System cleaning",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content:
                "Clean air ducts, coils, casing, and fan per manufacturer recommendations...",
              linkId: "bound hill steady",
            },
            {
              id: "task_5",
              title: "Filter replacement",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 8760,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content:
                "Replace all air and water filters according to maintenance schedule...",
              linkId: "filter swap routine",
            },
            {
              id: "task_6",
              title: "Calibration of monitoring instruments",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 4380,
              where: "Royal Infirmary - Facility",
              minutes: 30,
              skill: {
                Skilling: "Instrumentation Technician",
                SkillingCode: "IT",
              },
              content:
                "Calibrate sensors and meters following manufacturer guidelines...",
              linkId: "monitor cal check",
            },
            {
              id: "task_7",
              title: "Emergency lighting test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 720,
              where: "Royal Infirmary - Facility",
              minutes: 10,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Test emergency lighting circuits to ensure proper operation...",
              linkId: "emerg light test",
            },
            {
              id: "task_80",
              title: "Ventilation airflow check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HV" },
              content:
                "Measure airflow and verify compliance with standards...",
              linkId: "vent flow check",
            },
            {
              id: "task_9",
              title: "Water quality sampling",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 25,
              skill: { Skilling: "Plumbing Engineer", SkillingCode: "PE" },
              content:
                "Collect and test water samples to ensure quality standards are met...",
              linkId: "water sample check",
            },
            {
              id: "task_10333",
              title: "Fire alarm system test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Fire Safety Officer", SkillingCode: "FS" },
              content:
                "Conduct full fire alarm test and log results in maintenance records...",
              linkId: "fire alarm check",
            },
          ],
        },
        {
          id: "schedule_2",
          code: "05-31-0020",
          title: "Royal Infirmary - Facility - Air to Water Heat Pump",
          rawTitle: "Air to Water Heat Pump",
          tasks: [
            {
              id: "task_50",
              title: "System pressure check",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 168,
              where: "Royal Infirmary - Facility",
              minutes: 10,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HVAC" },
              content: "Check system pressure and adjust as needed...",
              linkId: "pressure monitoring",
            },
            {
              id: "task_6",
              title: "Refrigerant level check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 730,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content: "Check refrigerant levels and top up if necessary...",
              linkId: "refrigerant check",
            },
            {
              id: "task_70",
              title: "Filter cleaning",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "General Maintenance", SkillingCode: "GM" },
              content: "Clean or replace air filters...",
              linkId: "filter maintenance",
            },
            {
              id: "task_15",
              title: "Filter replacement",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 8760,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content:
                "Replace all air and water filters according to maintenance schedule...",
              linkId: "filter swap routine",
            },
            {
              id: "task_16",
              title: "Calibration of monitoring instruments",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 4380,
              where: "Royal Infirmary - Facility",
              minutes: 30,
              skill: {
                Skilling: "Instrumentation Technician",
                SkillingCode: "IT",
              },
              content:
                "Calibrate sensors and meters following manufacturer guidelines...",
              linkId: "monitor cal check",
            },
            {
              id: "task_17",
              title: "Emergency lighting test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 720,
              where: "Royal Infirmary - Facility",
              minutes: 10,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Test emergency lighting circuits to ensure proper operation...",
              linkId: "emerg light test",
            },
            {
              id: "task_18",
              title: "Ventilation airflow check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HV" },
              content:
                "Measure airflow and verify compliance with standards...",
              linkId: "vent flow check",
            },
            {
              id: "task_19",
              title: "Water quality sampling",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 25,
              skill: { Skilling: "Plumbing Engineer", SkillingCode: "PE" },
              content:
                "Collect and test water samples to ensure quality standards are met...",
              linkId: "water sample check",
            },
            {
              id: "task_20",
              title: "Fire alarm system test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Fire Safety Officer", SkillingCode: "FS" },
              content:
                "Conduct full fire alarm test and log results in maintenance records...",
              linkId: "fire alarm check",
            },
          ],
        },
      ],
    },
    {
      id: "regime_2",
      name: "Secondary Building Maintenance",
      version: "1.5",
      schedules: [
        {
          id: "schedule_3",
          code: "30-15-0005",
          title: "Secondary Building - Electrical Systems",
          rawTitle: "Electrical Systems",
          tasks: [
            {
              id: "task_81",
              title: "Circuit testing",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 4380,
              where: "Secondary Building",
              minutes: 45,
              skill: { Skilling: "Electrician", SkillingCode: "ELEC" },
              content: "Test all electrical circuits for safety compliance...",
              linkId: "electrical safety",
            },
            {
              id: "task_9",
              title: "Emergency lighting test",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 730,
              where: "Secondary Building",
              minutes: 30,
              skill: { Skilling: "Electrician", SkillingCode: "ELEC" },
              content: "Test all emergency lighting systems...",
              linkId: "emergency protocols",
            },
          ],
        },
      ],
    },
    {
      id: "regime_3",
      name: "Laboratory Equipment Maintenance",
      version: "1.2",
      schedules: [
        {
          id: "schedule_4",
          code: "40-22-0011",
          title: "Chemistry Lab - Fume Hood",
          rawTitle: "Fume Hood",
          tasks: [
            {
              id: "task_10122",
              title: "Airflow inspection",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 168,
              where: "Chemistry Lab",
              minutes: 15,
              skill: { Skilling: "Lab Technician", SkillingCode: "LT" },
              content:
                "Measure face velocity and airflow to ensure proper containment...",
              linkId: "airflow inspection",
            },
            {
              id: "task_11",
              title: "Filter replacement",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 8760,
              where: "Chemistry Lab",
              minutes: 45,
              skill: { Skilling: "Lab Technician", SkillingCode: "LT" },
              content:
                "Replace HEPA and carbon filters per manufacturer guidelines...",
              linkId: "filter replacement",
            },
          ],
        },
      ],
    },
    {
      id: "regime_4",
      name: "HVAC Plant Maintenance",
      version: "3.0",
      schedules: [
        {
          id: "schedule_5",
          code: "50-18-0032",
          title: "Main Plant - Chiller Unit",
          rawTitle: "Chiller Unit",
          tasks: [
            {
              id: "task_12",
              title: "Refrigerant leak check",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 720,
              where: "Main Plant",
              minutes: 60,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HVAC" },
              content:
                "Inspect all connections and valves for refrigerant leaks...",
              linkId: "refrigerant leak check",
            },
            {
              id: "task_13",
              title: "Condenser cleaning",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Main Plant",
              minutes: 90,
              skill: { Skilling: "Maintenance Engineer", SkillingCode: "ME" },
              content:
                "Clean condenser coils and check for debris accumulation...",
              linkId: "condenser cleaning",
            },
            {
              id: "task_500",
              title: "Filter replacement",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 8760,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content:
                "Replace all air and water filters according to maintenance schedule...",
              linkId: "filter swap routine",
            },
            {
              id: "task_6",
              title: "Calibration of monitoring instruments",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 4380,
              where: "Royal Infirmary - Facility",
              minutes: 30,
              skill: {
                Skilling: "Instrumentation Technician",
                SkillingCode: "IT",
              },
              content:
                "Calibrate sensors and meters following manufacturer guidelines...",
              linkId: "monitor cal check",
            },
            {
              id: "task_700",
              title: "Emergency lighting test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 720,
              where: "Royal Infirmary - Facility",
              minutes: 10,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Test emergency lighting circuits to ensure proper operation...",
              linkId: "emerg light test",
            },
            {
              id: "task_82",
              title: "Ventilation airflow check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HV" },
              content:
                "Measure airflow and verify compliance with standards...",
              linkId: "vent flow check",
            },
            {
              id: "task_9",
              title: "Water quality sampling",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 25,
              skill: { Skilling: "Plumbing Engineer", SkillingCode: "PE" },
              content:
                "Collect and test water samples to ensure quality standards are met...",
              linkId: "water sample check",
            },
            {
              id: "task_1012",
              title: "Fire alarm system test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Fire Safety Officer", SkillingCode: "FS" },
              content:
                "Conduct full fire alarm test and log results in maintenance records...",
              linkId: "fire alarm check",
            },
          ],
        },
        {
          id: "schedule_6",
          code: "50-18-0040",
          title: "Main Plant - Cooling Tower",
          rawTitle: "Cooling Tower",
          tasks: [
            {
              id: "task_14",
              title: "Water treatment check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 168,
              where: "Main Plant",
              minutes: 30,
              skill: {
                Skilling: "Water Treatment Specialist",
                SkillingCode: "WTS",
              },
              content:
                "Test and adjust chemical levels to prevent scaling and corrosion...",
              linkId: "water treatment check",
            },
            {
              id: "task_15",
              title: "Fan and motor inspection",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 730,
              where: "Main Plant",
              minutes: 45,
              skill: { Skilling: "Mechanical Engineer", SkillingCode: "ME" },
              content:
                "Inspect fan blades, motor mounts, and lubrication points...",
              linkId: "fan motor inspection",
            },
            {
              id: "task_50000",
              title: "Filter replacement",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 8760,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Refrigeration Engineer", SkillingCode: "RE" },
              content:
                "Replace all air and water filters according to maintenance schedule...",
              linkId: "filter swap routine",
            },
            {
              id: "task_6",
              title: "Calibration of monitoring instruments",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 4380,
              where: "Royal Infirmary - Facility",
              minutes: 30,
              skill: {
                Skilling: "Instrumentation Technician",
                SkillingCode: "IT",
              },
              content:
                "Calibrate sensors and meters following manufacturer guidelines...",
              linkId: "monitor cal check",
            },
            {
              id: "task_7000",
              title: "Emergency lighting test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 720,
              where: "Royal Infirmary - Facility",
              minutes: 10,
              skill: { Skilling: "Competent Person", SkillingCode: "CP" },
              content:
                "Test emergency lighting circuits to ensure proper operation...",
              linkId: "emerg light test",
            },
            {
              id: "task_83",
              title: "Ventilation airflow check",
              classification: "Amber",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 15,
              skill: { Skilling: "HVAC Technician", SkillingCode: "HV" },
              content:
                "Measure airflow and verify compliance with standards...",
              linkId: "vent flow check",
            },
            {
              id: "task_9",
              title: "Water quality sampling",
              classification: "Green",
              frequencyChange: null,
              intervalInHours: 2190,
              where: "Royal Infirmary - Facility",
              minutes: 25,
              skill: { Skilling: "Plumbing Engineer", SkillingCode: "PE" },
              content:
                "Collect and test water samples to ensure quality standards are met...",
              linkId: "water sample check",
            },
            {
              id: "task_101",
              title: "Fire alarm system test",
              classification: "Red",
              frequencyChange: null,
              intervalInHours: 876,
              where: "Royal Infirmary - Facility",
              minutes: 20,
              skill: { Skilling: "Fire Safety Officer", SkillingCode: "FS" },
              content:
                "Conduct full fire alarm test and log results in maintenance records...",
              linkId: "fire alarm check",
            },
          ],
        },
      ],
    },
  ];

  const templates = [
    {
      id: "critical_only",
      name: "Critical Only",
      description:
        "Import only Statutory & Mandatory (Red) and Business Critical (Amber) tasks",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      classifications: ["Red", "Amber"],
    },
    {
      id: "statutory_only",
      name: "Statutory Only",
      description:
        "Import only Statutory & Mandatory (Red) tasks - legally required maintenance",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      classifications: ["Red"],
    },
    {
      id: "business_critical",
      name: "Business Critical Only",
      description:
        "Import only Business Critical (Amber) tasks - important but not statutory",
      icon: Target,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      classifications: ["Amber"],
    },
    {
      id: "all_tasks",
      name: "All Tasks",
      description:
        "Import all maintenance tasks including Red, Amber, and Green classifications",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      classifications: ["Red", "Amber", "Green"],
    },
  ];

  // Fixed mapping rules - users cannot change these
  const fixedMappingRules = [
    {
      sfg20Field: "Schedule - Raw Title",
      sfg20Example: "Biomass Boiler",
      simproField: "Asset Type/Name",
      simproDescription: "Equipment or system being maintained",
    },
    {
      sfg20Field: "Task Title",
      sfg20Example: "Formal Visual Inspection",
      simproField: "Task Name",
      simproDescription: "Name of the maintenance activity",
    },
    {
      sfg20Field: "Task - Content",
      sfg20Example: "Confirm inspection frequency and ensure compliance...",
      simproField: "Test Readings",
      simproDescription: "Individual checks or instructions for the task",
    },
    {
      sfg20Field: "Task - Classification",
      sfg20Example: "Red / Amber / Green",
      simproField: "Priority Level",
      simproDescription: "Criticality of the maintenance task",
    },
    {
      sfg20Field: "Frequency - Interval (Hours)",
      sfg20Example: "730 hours (1 month)",
      simproField: "Service Level",
      simproDescription: "How often the task should be performed",
    },
    {
      sfg20Field: "Task - Where",
      sfg20Example: "Royal Infirmary - Facility",
      simproField: "Asset Location",
      simproDescription: "Physical location of the asset",
    },
    {
      sfg20Field: "Skill - Skilling",
      sfg20Example: "Competent Person (CP)",
      simproField: "Required Technician Level",
      simproDescription: "Skill level or qualification required",
    },
    {
      sfg20Field: "Task - Minutes",
      sfg20Example: "5 minutes",
      simproField: "Estimated Duration",
      simproDescription: "Expected time to complete the task",
    },
    {
      sfg20Field: "Schedule - Code",
      sfg20Example: "16-08",
      simproField: "Asset Reference Code",
      simproDescription: "Unique identifier for the asset type",
    },
    {
      sfg20Field: "Schedule - Schedule Categories",
      sfg20Example: "SFG20 > Boilers/Heat Generators",
      simproField: "Asset Category",
      simproDescription: "Category or group of the asset",
    },
    {
      sfg20Field: "Task - Steps",
      sfg20Example:
        '["Confirm inspection frequency via risk assessment...", ...]',
      simproField: "Test Readings Details",
      simproDescription: "Detailed steps for the task (part of test readings)",
    },
    {
      sfg20Field: "Task - Full Html Content",
      sfg20Example: "<p>All electrical equipment that falls outside...</p>",
      simproField: "Task Notes or Instructions",
      simproDescription: "Full detailed instructions in HTML format",
    },
    {
      sfg20Field: "Task - Url",
      sfg20Example: "https://www.demo.facilities-iq.com/sfg20?phrase=...",
      simproField: "Reference URL",
      simproDescription: "External reference link for the task",
    },
    {
      sfg20Field: "Schedule - Version",
      sfg20Example: "8",
      simproField: "Asset Version",
      simproDescription: "Version of the asset schedule",
    },
    {
      sfg20Field: "Schedule - Modified",
      sfg20Example: "2024-01-25T15:35:43.04505Z",
      simproField: "Last Updated Date",
      simproDescription: "Date the schedule was last modified",
    },
    {
      sfg20Field: "Schedule - Retired",
      sfg20Example: "false",
      simproField: "Asset Status",
      simproDescription:
        "Whether the asset is active or retired (active/inactive)",
    },
    {
      sfg20Field: "Frequency - Label",
      sfg20Example: "1M",
      simproField: "Frequency Label",
      simproDescription: "Human-readable frequency (e.g., monthly)",
    },
    {
      sfg20Field: "Task - ExecutionOrder",
      sfg20Example: "0, 1, 2...",
      simproField: "Task Order",
      simproDescription: "Order in which tasks should be performed",
    },
    {
      sfg20Field: "Task - FullContent",
      sfg20Example: "All electrical equipment that falls outside...",
      simproField: "Full Task Description",
      simproDescription: "Plain text full description of the task",
    },
  ];

  useEffect(() => {
    const totalTasks = mockRegimes.reduce(
      (sum, regime) =>
        sum +
        regime.schedules.reduce(
          (scheduleSum, schedule) => scheduleSum + schedule.tasks.length,
          0
        ),
      0
    );
    const selectedTasksCount = selectedTasks.length;
    const progress =
      totalTasks > 0 ? (selectedTasksCount / totalTasks) * 100 : 0;
    setMappingProgress(progress);
  }, [selectedTasks]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);

    // Select tasks based on template classifications
    const filteredTasks = mockRegimes.flatMap((regime) =>
      regime.schedules.flatMap((schedule) =>
        schedule.tasks.filter((task) =>
          template.classifications.includes(task.classification)
        )
      )
    );

    const taskIds = filteredTasks.map((t) => t.id);
    const scheduleIds = [
      ...new Set(
        mockRegimes.flatMap((regime) =>
          regime.schedules
            .filter((schedule) =>
              schedule.tasks.some((task) => taskIds.includes(task.id))
            )
            .map((s) => s.id)
        )
      ),
    ];
    const regimeIds = mockRegimes
      .filter((regime) =>
        regime.schedules.some((schedule) => scheduleIds.includes(schedule.id))
      )
      .map((r) => r.id);

    setSelectedTasks(taskIds);
    setSelectedSchedules(scheduleIds);
    setSelectedRegimes(regimeIds);
  };

  const handleRegimeToggle = (regimeId: string) => {
    const regime = mockRegimes.find((r) => r.id === regimeId);
    if (!regime) return;

    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    const regimeTaskIds = regime.schedules.flatMap((s) =>
      s.tasks
        .filter((t) => template.classifications.includes(t.classification))
        .map((t) => t.id)
    );
    const regimeScheduleIds = regime.schedules
      .filter((s) => s.tasks.some((t) => regimeTaskIds.includes(t.id)))
      .map((s) => s.id);

    if (selectedRegimes.includes(regimeId)) {
      setSelectedRegimes((prev) => prev.filter((id) => id !== regimeId));
      setSelectedSchedules((prev) =>
        prev.filter((id) => !regimeScheduleIds.includes(id))
      );
      setSelectedTasks((prev) =>
        prev.filter((id) => !regimeTaskIds.includes(id))
      );
    } else {
      setSelectedRegimes((prev) => [...prev, regimeId]);
      setSelectedSchedules((prev) => [...prev, ...regimeScheduleIds]);
      setSelectedTasks((prev) => [...prev, ...regimeTaskIds]);
    }
  };

  const handleScheduleToggle = (scheduleId: string) => {
    const schedule = mockRegimes
      .flatMap((r) => r.schedules)
      .find((s) => s.id === scheduleId);
    if (!schedule) return;

    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    const scheduleTaskIds = schedule.tasks
      .filter((t) => template.classifications.includes(t.classification))
      .map((t) => t.id);

    if (selectedSchedules.includes(scheduleId)) {
      setSelectedSchedules((prev) => prev.filter((id) => id !== scheduleId));
      setSelectedTasks((prev) =>
        prev.filter((id) => !scheduleTaskIds.includes(id))
      );
    } else {
      setSelectedSchedules((prev) => [...prev, scheduleId]);
      setSelectedTasks((prev) => [...prev, ...scheduleTaskIds]);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    } else {
      setSelectedTasks((prev) => [...prev, taskId]);
    }
  };

  const handleSaveAndExport = async () => {
    if (selectedTasks.length === 0) {
      alert("Please select at least one task to export.");
      return;
    }

    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const exportData = {
      selectedTasks,
      selectedSchedules,
      selectedRegimes,
      selectedTemplate,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("export_data", JSON.stringify(exportData));

    setIsExporting(false);
    setExportComplete(true);

    setTimeout(() => {
      onContinue();
    }, 1500);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Red":
        return "bg-red-100 text-red-800 border-red-300";
      case "Amber":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Green":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getClassificationLabel = (classification: string) => {
    switch (classification) {
      case "Red":
        return "Statutory & Mandatory";
      case "Amber":
        return "Business Critical";
      case "Green":
        return "Recommended";
      default:
        return classification;
    }
  };

  const convertIntervalToReadable = (hours: number) => {
    if (hours < 24) return `${hours} hours`;
    if (hours < 168) return `${Math.round(hours / 24)} days`;
    if (hours < 730) return `${Math.round(hours / 168)} weeks`;
    if (hours < 8760) return `${Math.round(hours / 730)} months`;
    return `${Math.round(hours / 8760)} years`;
  };

  const toggleTaskListExpansion = (scheduleId: string) => {
    setExpandedTaskLists((prev) => ({
      ...prev,
      [scheduleId]: !prev[scheduleId],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Map to Simpro
            </h1>
            <p className="text-sm text-muted-foreground">
              Select data to export with pre-configured field mappings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {selectedTasks.length} tasks selected
            </Badge>
            <Progress value={mappingProgress} className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={currentStep}
          onValueChange={(value) => setCurrentStep(value as any)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">1. Choose Template</TabsTrigger>
            <TabsTrigger value="selection" disabled={!selectedTemplate}>
              2. Select Data
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={selectedTasks.length === 0}>
              3. Preview & Export
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Field Mapping is Pre-Configured</AlertTitle>
              <AlertDescription>
                The mapping between SFG20 and Simpro fields is standardized and
                cannot be changed. This ensures data consistency and prevents
                mapping errors.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Choose a Template</CardTitle>
                <CardDescription>
                  Select which tasks to import based on criticality. Templates
                  automatically filter tasks by their classification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id
                            ? `ring-2 ring-accent ${template.borderColor}`
                            : ""
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${template.bgColor}`}
                            >
                              <Icon className={`h-5 w-5 ${template.color}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {template.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {template.classifications.map((classification) => (
                              <Badge
                                key={classification}
                                className={`${getClassificationColor(
                                  classification
                                )} border`}
                                variant="outline"
                              >
                                {getClassificationLabel(classification)}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedTemplate && (
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Template Selected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {
                        templates.find((t) => t.id === selectedTemplate)
                          ?.description
                      }
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep("selection")}
                    disabled={!selectedTemplate}
                  >
                    Continue to Selection
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Mapping Rules Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Standard Field Mapping (Read-Only) SFG20 to Simpro
                </CardTitle>
                <CardDescription>
                  These mappings are standardized across all exports and cannot
                  be modified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(showAllMappings
                    ? fixedMappingRules
                    : fixedMappingRules.slice(0, 6)
                  ).map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {rule.sfg20Field}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rule.sfg20Example}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {rule.simproField}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rule.simproDescription}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {fixedMappingRules.length > 4 && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllMappings(!showAllMappings)}
                      className="gap-2"
                    >
                      {showAllMappings ? (
                        <>
                          Show Less
                          <ChevronRight className="h-4 w-4 -rotate-90" />
                        </>
                      ) : (
                        <>
                          View All {fixedMappingRules.length} Mappings
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Selection Tab */}
          <TabsContent value="selection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Select Data to Export
                    </CardTitle>
                    <CardDescription>
                      Choose which regimes, assets, and maintenance tasks to
                      include in your export
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-2">
                        {mockRegimes.map((regime) => {
                          const template = templates.find(
                            (t) => t.id === selectedTemplate
                          );
                          const filteredSchedules = regime.schedules.filter(
                            (schedule) =>
                              schedule.tasks.some((task) =>
                                template?.classifications.includes(
                                  task.classification
                                )
                              )
                          );

                          if (filteredSchedules.length === 0) return null;

                          return (
                            <Collapsible key={regime.id}>
                              <div className="flex items-center gap-2 w-full p-3 hover:bg-muted rounded-lg">
                                <Checkbox
                                  checked={selectedRegimes.includes(regime.id)}
                                  onCheckedChange={() =>
                                    handleRegimeToggle(regime.id)
                                  }
                                />
                                <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                                  <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                                  <Building className="h-4 w-4 text-blue-500" />
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-blue-100 text-blue-700"
                                  >
                                    REGIME
                                  </Badge>
                                  <span className="font-medium flex-1 text-left">
                                    {regime.name}
                                  </span>
                                  <Badge variant="outline">
                                    v{regime.version}
                                  </Badge>
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent className="ml-6 mt-2 space-y-2">
                                {filteredSchedules.map((schedule) => {
                                  const filteredTasks = schedule.tasks.filter(
                                    (task) =>
                                      template?.classifications.includes(
                                        task.classification
                                      )
                                  );
                                  const showAllTasks =
                                    expandedTaskLists[schedule.id] ||
                                    filteredTasks.length <= 5;
                                  const displayedTasks = showAllTasks
                                    ? filteredTasks
                                    : filteredTasks.slice(0, 5);
                                  const hasMoreTasks = filteredTasks.length > 5;

                                  return (
                                    <div
                                      key={schedule.id}
                                      className="space-y-2"
                                    >
                                      <Collapsible>
                                        <div className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded">
                                          <Checkbox
                                            checked={selectedSchedules.includes(
                                              schedule.id
                                            )}
                                            onCheckedChange={() =>
                                              handleScheduleToggle(schedule.id)
                                            }
                                          />
                                          <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                                            <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                                            <FileText className="h-4 w-4 text-green-500" />
                                            <Badge
                                              variant="secondary"
                                              className="text-xs bg-green-100 text-green-700"
                                            >
                                              ASSET
                                            </Badge>
                                            <span className="text-sm flex-1 text-left font-medium">
                                              {schedule.rawTitle}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {filteredTasks.length} tasks
                                            </Badge>
                                          </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="ml-6 mt-1 space-y-1">
                                          {displayedTasks.map((task) => (
                                            <div
                                              key={task.id}
                                              className="flex items-center gap-2 p-2 hover:bg-muted rounded"
                                            >
                                              <Checkbox
                                                checked={selectedTasks.includes(
                                                  task.id
                                                )}
                                                onCheckedChange={() =>
                                                  handleTaskToggle(task.id)
                                                }
                                              />
                                              <Zap className="h-4 w-4 text-orange-500" />
                                              <Badge
                                                variant="secondary"
                                                className="text-xs bg-orange-100 text-orange-700"
                                              >
                                                TASK
                                              </Badge>
                                              <span className="text-sm flex-1">
                                                {task.title}
                                              </span>
                                              <Badge
                                                className={`text-xs border ${getClassificationColor(
                                                  task.classification
                                                )}`}
                                                variant="outline"
                                              >
                                                {getClassificationLabel(
                                                  task.classification
                                                )}
                                              </Badge>
                                            </div>
                                          ))}

                                          {hasMoreTasks && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full mt-2 text-xs"
                                              onClick={() =>
                                                toggleTaskListExpansion(
                                                  schedule.id
                                                )
                                              }
                                            >
                                              {showAllTasks ? (
                                                <>
                                                  <ChevronDown className="h-3 w-3 mr-1 rotate-180" />
                                                  Show Less
                                                </>
                                              ) : (
                                                <>
                                                  <ChevronDown className="h-3 w-3 mr-1" />
                                                  Show{" "}
                                                  {filteredTasks.length - 5}{" "}
                                                  More Tasks
                                                </>
                                              )}
                                            </Button>
                                          )}
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  );
                                })}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    <Separator className="my-6" />

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-muted rounded-lg transition-colors">
                        <Layers className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-base">
                          Understanding the SFG20 Data Hierarchy
                        </span>
                        <ChevronRight className="h-4 w-4 ml-auto transition-transform data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-blue-700">
                                  Level 1: Regime
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Top-level organizational grouping
                                </p>
                              </div>
                            </div>

                            <div className="ml-12 space-y-2 p-4 bg-background rounded-lg border-l-4 border-blue-500">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-blue-700">
                                    Name:
                                  </span>
                                  <p className="text-muted-foreground">
                                    Region 1 - Regime
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">
                                    Version:
                                  </span>
                                  <p className="text-muted-foreground">2</p>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">
                                    ID:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    ifhVJoSJviLtNG
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">
                                    GUID:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    d21b8078-0faf-5099...
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground italic mt-2">
                                A regime represents a collection of maintenance
                                schedules for a facility or region
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500 to-green-500" />
                          </div>

                          {/* Schedule Level */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-green-700">
                                  Level 2: Schedule (Asset)
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Equipment or system type requiring maintenance
                                </p>
                              </div>
                            </div>

                            <div className="ml-12 space-y-2 p-4 bg-background rounded-lg border-l-4 border-green-500">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-green-700">
                                    Raw Title:
                                  </span>
                                  <p className="text-muted-foreground">
                                    Biomass Boiler
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-700">
                                    Code:
                                  </span>
                                  <p className="text-muted-foreground">
                                    05-38-0018
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-700">
                                    Full Title:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    Region 1 › Royal Infirmary - Biomass Boiler
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-700">
                                    Category:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    SFG20 › Boilers/Heat Generators
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-700">
                                    Version:
                                  </span>
                                  <p className="text-muted-foreground">8</p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-700">
                                    Modified:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    2024-01-25
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground italic mt-2">
                                Schedules define specific equipment types and
                                contain all maintenance tasks for that asset
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="h-8 w-0.5 bg-gradient-to-b from-green-500 to-orange-500" />
                          </div>

                          {/* Task Level */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <Zap className="h-5 w-5 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-orange-700">
                                  Level 3: Task
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Individual maintenance activity
                                </p>
                              </div>
                            </div>

                            <div className="ml-12 space-y-2 p-4 bg-background rounded-lg border-l-4 border-orange-500">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="col-span-2">
                                  <span className="font-medium text-orange-700">
                                    Title:
                                  </span>
                                  <p className="text-muted-foreground">
                                    Formal Visual Inspection of in-service
                                    electrical equipment
                                  </p>
                                </div>
                                <div className=" flex items-center gap-x-2">
                                  <span className="font-medium text-orange-700">
                                    Classification:
                                  </span>
                                  <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                                    Statutory & Mandatory
                                  </Badge>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-700">
                                    Frequency:
                                  </span>
                                  <p className="text-muted-foreground">
                                    730 hours (1 month)
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-700">
                                    Duration:
                                  </span>
                                  <p className="text-muted-foreground">
                                    5 minutes
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-700">
                                    Skill Required:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    Competent Person (CP)
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium text-orange-700">
                                    Location:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    Royal Infirmary - Facility
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium text-orange-700">
                                    Description:
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    Confirm inspection frequency with a risk
                                    assessment considering environment, usage
                                    rate, equipment condition/age...
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground italic mt-2">
                                Tasks are the actual maintenance activities
                                performed on assets, with detailed instructions
                                and requirements
                              </p>
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <div className="space-y-2">
                                <h5 className="font-semibold text-sm">
                                  How to Use This Hierarchy
                                </h5>
                                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                  <li>
                                    <strong>Select Regimes</strong> to include
                                    all assets and tasks within that
                                    organizational group
                                  </li>
                                  <li>
                                    <strong>Select Assets</strong> to include
                                    all maintenance tasks for that specific
                                    equipment type
                                  </li>
                                  <li>
                                    <strong>Select Tasks</strong> individually
                                    for granular control over what gets exported
                                  </li>
                                  <li>
                                    Your selections cascade down: selecting a
                                    regime automatically selects its assets and
                                    tasks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Selection Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedRegimes.length}
                        </div>
                        <div className="text-sm text-blue-700">Regimes</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Top-level groupings
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedSchedules.length}
                        </div>
                        <div className="text-sm text-green-700">Assets</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Equipment types
                        </div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedTasks.length}
                        </div>
                        <div className="text-sm text-orange-700">Tasks</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Maintenance activities
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        Classification Breakdown
                      </h4>
                      {["Red", "Amber", "Green"].map((classification) => {
                        const count = mockRegimes
                          .flatMap((r) => r.schedules.flatMap((s) => s.tasks))
                          .filter(
                            (t) =>
                              selectedTasks.includes(t.id) &&
                              t.classification === classification
                          ).length;
                        if (count === 0) return null;
                        return (
                          <div
                            key={classification}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  classification === "Red"
                                    ? "bg-red-500"
                                    : classification === "Amber"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                              />
                              <span>
                                {getClassificationLabel(classification)}
                              </span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("overview")}
              >
                Back to Templates
              </Button>
              <Button
                onClick={() => setCurrentStep("preview")}
                disabled={selectedTasks.length === 0}
              >
                Preview Mapping
                <Eye className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Read-Only Preview</AlertTitle>
              <AlertDescription>
                This preview shows how your SFG20 data will be mapped to Simpro.
                Field mappings are standardized and cannot be changed.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Mapping Preview
                </CardTitle>
                <CardDescription>
                  Review how your selected data will appear in Simpro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {mockRegimes
                      .flatMap((r) =>
                        r.schedules.flatMap((s) =>
                          s.tasks
                            .filter((t) => selectedTasks.includes(t.id))
                            .map((t) => ({ ...t, schedule: s, regime: r }))
                        )
                      )
                      .slice(0, 10)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge
                              className={`text-xs border ${getClassificationColor(
                                item.classification
                              )}`}
                              variant="outline"
                            >
                              {getClassificationLabel(item.classification)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <h5 className="font-medium text-muted-foreground">
                                SFG20 Data
                              </h5>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <strong>Schedule - Raw Title:</strong>{" "}
                                  {item.schedule.rawTitle}
                                </div>
                                <div>
                                  <strong>Task Title:</strong> {item.title}
                                </div>
                                <div>
                                  <strong>Task Classification:</strong>{" "}
                                  {item.classification}
                                </div>
                                <div>
                                  <strong>Frequency Interval:</strong>{" "}
                                  {convertIntervalToReadable(
                                    item.intervalInHours
                                  )}
                                </div>
                                <div>
                                  <strong>Task - Where:</strong> {item.where}
                                </div>
                                <div>
                                  <strong>Skill - Skilling:</strong>{" "}
                                  {item.skill.Skilling}
                                </div>
                                <div>
                                  <strong>Task Minutes:</strong> {item.minutes}{" "}
                                  minutes
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-medium text-muted-foreground">
                                Simpro Mapping
                              </h5>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <strong>Asset Type/Name:</strong>{" "}
                                  {item.schedule.rawTitle}
                                </div>
                                <div>
                                  <strong>Maintenance Task Name:</strong>{" "}
                                  {item.title}
                                </div>
                                <div>
                                  <strong>Priority Level:</strong>{" "}
                                  {item.classification === "Red"
                                    ? "High"
                                    : item.classification === "Amber"
                                    ? "Medium"
                                    : "Low"}
                                </div>
                                <div>
                                  <strong>Service Level:</strong> Every{" "}
                                  {convertIntervalToReadable(
                                    item.intervalInHours
                                  )}
                                </div>
                                <div>
                                  <strong>Asset Location:</strong> {item.where}
                                </div>
                                <div>
                                  <strong>Required Technician Level:</strong>{" "}
                                  {item.skill.Skilling}
                                </div>
                                <div>
                                  <strong>Est. Duration:</strong> {item.minutes}{" "}
                                  minutes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {selectedTasks.length > 10 && (
                      <div className="text-center p-4 text-muted-foreground">
                        ... and {selectedTasks.length - 10} more tasks
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Ready to Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedTasks.length}
                    </div>
                    <div className="text-sm text-blue-700">Tasks Selected</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {fixedMappingRules.length}
                    </div>
                    <div className="text-sm text-green-700">Field Mappings</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {templates.find((t) => t.id === selectedTemplate)?.name}
                    </div>
                    <div className="text-sm text-purple-700">Template</div>
                  </div>
                </div>

                {isExporting && (
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Preparing Export...
                      </span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}

                {exportComplete && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-800">
                        Ready for Export!
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Redirecting to export interface...
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("selection")}
                    disabled={isExporting}
                  >
                    Back to Selection
                  </Button>
                  <Button
                    onClick={handleSaveAndExport}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isExporting || selectedTasks.length === 0}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Continue to Export
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
