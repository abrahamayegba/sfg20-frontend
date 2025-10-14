// Settings management for SFG20 application
export interface AppSettings {
  notifications: {
    scheduleUpdates: boolean
    exportComplete: boolean
    importComplete: boolean
    emailNotifications: boolean
  }
  display: {
    theme: "light" | "dark" | "system"
    compactMode: boolean
    showTaskDetails: boolean
  }
  export: {
    defaultFormat: "json" | "csv" | "xml"
    includeMetadata: boolean
    autoDownload: boolean
  }
  sync: {
    autoImport: boolean
    importInterval: number // in hours
    lastSync: string
  }
}

const defaultSettings: AppSettings = {
  notifications: {
    scheduleUpdates: true,
    exportComplete: true,
    importComplete: true,
    emailNotifications: false,
  },
  display: {
    theme: "system",
    compactMode: false,
    showTaskDetails: true,
  },
  export: {
    defaultFormat: "json",
    includeMetadata: true,
    autoDownload: false,
  },
  sync: {
    autoImport: false,
    importInterval: 24,
    lastSync: "",
  },
}

export const settingsService = {
  getSettings: (): AppSettings => {
    if (typeof window === "undefined") return defaultSettings

    const settings = localStorage.getItem("sfg20_settings")
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings
  },

  updateSettings: (updates: Partial<AppSettings>) => {
    const currentSettings = settingsService.getSettings()
    const newSettings = { ...currentSettings, ...updates }
    localStorage.setItem("sfg20_settings", JSON.stringify(newSettings))
    return newSettings
  },

  resetSettings: () => {
    localStorage.setItem("sfg20_settings", JSON.stringify(defaultSettings))
    return defaultSettings
  },

  exportSettings: () => {
    const settings = settingsService.getSettings()
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = "sfg20-settings.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  },

  importSettings: (settingsData: string): AppSettings => {
    try {
      const parsedSettings = JSON.parse(settingsData)
      const validatedSettings = { ...defaultSettings, ...parsedSettings }
      localStorage.setItem("sfg20_settings", JSON.stringify(validatedSettings))
      return validatedSettings
    } catch (error) {
      throw new Error("Invalid settings file format")
    }
  },
}
