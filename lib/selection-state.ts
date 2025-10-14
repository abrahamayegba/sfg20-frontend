// Selection state management for SFG20 data
export interface SelectedSchedule {
  scheduleId: string
  selectedTasks: string[]
  isFullSchedule: boolean
}

export interface SelectionState {
  selectedSchedules: SelectedSchedule[]
  totalSelectedTasks: number
  lastModified: string
}

export const selectionService = {
  getSelectionState: (): SelectionState => {
    if (typeof window === "undefined") {
      return { selectedSchedules: [], totalSelectedTasks: 0, lastModified: "" }
    }

    const saved = localStorage.getItem("sfg20_selection")
    return saved ? JSON.parse(saved) : { selectedSchedules: [], totalSelectedTasks: 0, lastModified: "" }
  },

  saveSelectionState: (state: SelectionState) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sfg20_selection", JSON.stringify(state))
    }
  },

  toggleScheduleSelection: (scheduleId: string, taskIds: string[]) => {
    const state = selectionService.getSelectionState()
    const existingIndex = state.selectedSchedules.findIndex((s) => s.scheduleId === scheduleId)

    if (existingIndex >= 0) {
      // Remove schedule
      state.selectedSchedules.splice(existingIndex, 1)
    } else {
      // Add schedule
      state.selectedSchedules.push({
        scheduleId,
        selectedTasks: taskIds,
        isFullSchedule: true,
      })
    }

    state.totalSelectedTasks = state.selectedSchedules.reduce((sum, s) => sum + s.selectedTasks.length, 0)
    state.lastModified = new Date().toISOString()

    selectionService.saveSelectionState(state)
    return state
  },

  toggleTaskSelection: (scheduleId: string, taskId: string, allTaskIds: string[]) => {
    const state = selectionService.getSelectionState()
    let scheduleSelection = state.selectedSchedules.find((s) => s.scheduleId === scheduleId)

    if (!scheduleSelection) {
      // Create new schedule selection
      scheduleSelection = {
        scheduleId,
        selectedTasks: [taskId],
        isFullSchedule: false,
      }
      state.selectedSchedules.push(scheduleSelection)
    } else {
      // Toggle task in existing selection
      const taskIndex = scheduleSelection.selectedTasks.indexOf(taskId)
      if (taskIndex >= 0) {
        scheduleSelection.selectedTasks.splice(taskIndex, 1)
        if (scheduleSelection.selectedTasks.length === 0) {
          // Remove schedule if no tasks selected
          const scheduleIndex = state.selectedSchedules.indexOf(scheduleSelection)
          state.selectedSchedules.splice(scheduleIndex, 1)
        }
      } else {
        scheduleSelection.selectedTasks.push(taskId)
      }

      // Update isFullSchedule flag
      scheduleSelection.isFullSchedule = scheduleSelection.selectedTasks.length === allTaskIds.length
    }

    state.totalSelectedTasks = state.selectedSchedules.reduce((sum, s) => sum + s.selectedTasks.length, 0)
    state.lastModified = new Date().toISOString()

    selectionService.saveSelectionState(state)
    return state
  },

  clearSelection: () => {
    const state: SelectionState = {
      selectedSchedules: [],
      totalSelectedTasks: 0,
      lastModified: new Date().toISOString(),
    }
    selectionService.saveSelectionState(state)
    return state
  },

  isScheduleSelected: (scheduleId: string): boolean => {
    const state = selectionService.getSelectionState()
    return state.selectedSchedules.some((s) => s.scheduleId === scheduleId)
  },

  isTaskSelected: (scheduleId: string, taskId: string): boolean => {
    const state = selectionService.getSelectionState()
    const schedule = state.selectedSchedules.find((s) => s.scheduleId === scheduleId)
    return schedule ? schedule.selectedTasks.includes(taskId) : false
  },

  getSelectedTasksForSchedule: (scheduleId: string): string[] => {
    const state = selectionService.getSelectionState()
    const schedule = state.selectedSchedules.find((s) => s.scheduleId === scheduleId)
    return schedule ? schedule.selectedTasks : []
  },
}
