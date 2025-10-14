"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Check,
  Trash2,
  MoreVertical,
  ExternalLink,
} from "lucide-react"
import { notificationService, type Notification } from "@/lib/notifications"

interface NotificationCenterProps {
  onNavigate?: (url: string) => void
}

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Generate some demo notifications on first load
    if (notificationService.getNotifications().length === 0) {
      generateDemoNotifications()
    }
  }, [])

  const loadNotifications = () => {
    setNotifications(notificationService.getNotifications())
  }

  const generateDemoNotifications = () => {
    // Generate schedule update notifications
    notificationService.generateScheduleUpdateNotifications()

    // Add some other demo notifications
    notificationService.addNotification({
      type: "success",
      title: "Export Complete",
      message:
        "Successfully exported 15 maintenance tasks to Simpro. All data has been processed and is ready for use.",
    })

    notificationService.addNotification({
      type: "info",
      title: "Welcome to SFG20 Data Manager",
      message: "Your account has been set up successfully. Start by importing your maintenance schedules from SFG20.",
    })

    loadNotifications()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
    loadNotifications()
  }

  const handleClearAll = () => {
    notificationService.clearNotifications()
    loadNotifications()
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl)
      setIsOpen(false)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          {unreadCount > 0 ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.read ? "bg-accent/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionLabel && (
                            <div className="flex items-center gap-1 text-xs text-accent">
                              <span>{notification.actionLabel}</span>
                              <ExternalLink className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
