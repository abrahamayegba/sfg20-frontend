export interface WaitlistEntry {
  id: string
  email: string
  name?: string
  company?: string
  role?: string
  submittedAt: string
  source: "landing" | "app"
}

class WaitlistService {
  private storageKey = "sfg20_waitlist_entries"

  addToWaitlist(entry: Omit<WaitlistEntry, "id" | "submittedAt">): WaitlistEntry {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    }

    const entries = this.getEntries()

    // Check if email already exists
    if (entries.some((e) => e.email === entry.email)) {
      throw new Error("Email already registered for waitlist")
    }

    entries.push(newEntry)
    localStorage.setItem(this.storageKey, JSON.stringify(entries))

    return newEntry
  }

  getEntries(): WaitlistEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  isEmailRegistered(email: string): boolean {
    return this.getEntries().some((entry) => entry.email === email)
  }

  getStats() {
    const entries = this.getEntries()
    return {
      total: entries.length,
      fromLanding: entries.filter((e) => e.source === "landing").length,
      fromApp: entries.filter((e) => e.source === "app").length,
      recent: entries.filter((e) => {
        const dayAgo = new Date()
        dayAgo.setDate(dayAgo.getDate() - 1)
        return new Date(e.submittedAt) > dayAgo
      }).length,
    }
  }
}

export const waitlistService = new WaitlistService()
