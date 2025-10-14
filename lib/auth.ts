// Authentication utilities for SFG20 application
export interface User {
  id: string
  email: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Authentication functions using localStorage
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would validate credentials
    if (password.length < 6) {
      throw new Error("Invalid credentials")
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("sfg20_user", JSON.stringify(user))
    return user
  },

  register: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration validation
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("sfg20_user", JSON.stringify(user))
    return user
  },

  logout: () => {
    localStorage.removeItem("sfg20_user")
    localStorage.removeItem("sfg20_data")
    localStorage.removeItem("sfg20_config")
    localStorage.removeItem("simpro_config")
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("sfg20_user")
    return userData ? JSON.parse(userData) : null
  },

  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null
  },
}
