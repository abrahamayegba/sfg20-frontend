// Notification system for SFG20 application
export interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionLabel?: string
  actionUrl?: string
}

export interface ScheduleUpdate {
  scheduleId: string
  scheduleName: string
  oldVersion: string
  newVersion: string
  updatedAt: string
}

export const notificationService = {
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return []

    const notifications = localStorage.getItem("sfg20_notifications")
    return notifications ? JSON.parse(notifications) : []
  },

  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const notifications = notificationService.getNotifications()
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    notifications.unshift(newNotification)

    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50)
    }

    localStorage.setItem("sfg20_notifications", JSON.stringify(notifications))
    return newNotification
  },

  markAsRead: (notificationId: string) => {
    const notifications = notificationService.getNotifications()
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      localStorage.setItem("sfg20_notifications", JSON.stringify(notifications))
    }
  },

  markAllAsRead: () => {
    const notifications = notificationService.getNotifications()
    notifications.forEach((n) => (n.read = true))
    localStorage.setItem("sfg20_notifications", JSON.stringify(notifications))
  },

  getUnreadCount: (): number => {
    return notificationService.getNotifications().filter((n) => !n.read).length
  },

  clearNotifications: () => {
    localStorage.setItem("sfg20_notifications", JSON.stringify([]))
  },

  // Check for schedule updates (mock implementation)
  checkForScheduleUpdates: (): ScheduleUpdate[] => {
    // In a real implementation, this would call the SFG20 API
    // For demo purposes, we'll simulate some updates
    const mockUpdates: ScheduleUpdate[] = [
      {
        scheduleId: "sfg20_001",
        scheduleName: "Boiler Annual Service",
        oldVersion: "v8.1",
        newVersion: "v8.2",
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      },
      {
        scheduleId: "sfg20_002",
        scheduleName: "Fire Alarm System Check",
        oldVersion: "v3.0",
        newVersion: "v3.1",
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      },
    ]

    return mockUpdates
  },

  generateScheduleUpdateNotifications: () => {
    const updates = notificationService.checkForScheduleUpdates()
    const existingNotifications = notificationService.getNotifications()

    updates.forEach((update) => {
      // Check if we already have a notification for this update
      const existingNotif = existingNotifications.find(
        (n) => n.message.includes(update.scheduleId) && n.message.includes(update.newVersion),
      )

      if (!existingNotif) {
        notificationService.addNotification({
          type: "warning",
          title: "Schedule Updated",
          message: `${update.scheduleName} has been updated from ${update.oldVersion} to ${update.newVersion}. Review before planning new tasks.`,
          actionLabel: "Review Changes",
          actionUrl: "/select",
        })
      }
    })
  },
}
