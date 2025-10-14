// Smart Words utility functions for SFG20 integration

export interface SmartWordsResult {
  found: boolean
  task?: {
    id: string
    title: string
    linkId: string
    url?: string
    content: string
    steps: string[]
  }
  error?: string
}

export const smartWordsService = {
  // Search for a task by Smart Words
  searchBySmartWords: async (smartWords: string): Promise<SmartWordsResult> => {
    // Simulate API call to SFG20 service
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock search results based on known Smart Words from the API documentation
    const mockResults: Record<string, SmartWordsResult> = {
      "quarter minor incident": {
        found: true,
        task: {
          id: "mock_task_1",
          title: "Hoists - daily checks",
          linkId: "quarter minor incident",
          url: "http://localhost:3030/sfg20?phrase=quarter+minor+incident",
          content:
            "Operate all hoists daily as per the manufacturer's handbook. Check operation and adjustment of hoist controllers; if found unresponsive or improperly adjusted, initiate repair or adjustment.",
          steps: [
            "Operate all hoists daily as per the manufacturer's handbook.",
            "Check operation and adjustment of hoist controllers; if found unresponsive or improperly adjusted, initiate repair or adjustment.",
            "Check effectiveness of hoist brakes and clutches; if ineffectiveness is noticed, repair or adjust them immediately.",
            "Visually inspect hoist wire or chain to ensure they are correctly located on drum, sheaves, or pulleys; if incorrectly located, reposition as required.",
            "Visually check hoist supporting structure and all bolted connections to ensure nothing has worked loose; tighten any loose bolts.",
            "Record any hoist defects encountered during daily checks in the daily log book.",
          ],
        },
      },
      "negative fact decorate": {
        found: true,
        task: {
          id: "mock_task_2",
          title: "Log book",
          linkId: "negative fact decorate",
          url: "http://localhost:3030/sfg20?phrase=negative+fact+decorate",
          content:
            "Consult the Log Book for any reported defects and address them as necessary, wearing appropriate personal protective equipment if required.",
          steps: [
            "Consult the Log Book for any reported defects and address them as necessary, wearing appropriate personal protective equipment if required.",
            "Record any completed works in the Log Book clearly according to the operating code of practice.",
          ],
        },
      },
    }

    const normalizedSearch = smartWords.toLowerCase().trim()
    const result = mockResults[normalizedSearch]

    if (result) {
      return result
    }

    return {
      found: false,
      error: `No task found for Smart Words: "${smartWords}". Please check the spelling and try again.`,
    }
  },

  // Validate Smart Words format (should be three words)
  validateSmartWords: (smartWords: string): { valid: boolean; error?: string } => {
    const trimmed = smartWords.trim()
    if (!trimmed) {
      return { valid: false, error: "Smart Words cannot be empty" }
    }

    const words = trimmed.split(/\s+/)
    if (words.length !== 3) {
      return { valid: false, error: "Smart Words must be exactly three words" }
    }

    // Check for valid characters (letters and basic punctuation)
    const validPattern = /^[a-zA-Z\s\-']+$/
    if (!validPattern.test(trimmed)) {
      return { valid: false, error: "Smart Words can only contain letters, spaces, hyphens, and apostrophes" }
    }

    return { valid: true }
  },

  // Generate Smart Words URL for SFG20 app/web access
  generateSFG20Url: (smartWords: string, baseUrl = "http://localhost:3030/sfg20"): string => {
    const encoded = encodeURIComponent(smartWords.replace(/\s+/g, "+"))
    return `${baseUrl}?phrase=${encoded}`
  },

  // Extract Smart Words from task content (if embedded)
  extractSmartWordsFromContent: (content: string): string | null => {
    // Look for "Smart Words:" pattern in content
    const match = content.match(/Smart Words:\s*([a-zA-Z\s\-']+)/i)
    if (match && match[1]) {
      const words = match[1].trim().split(/\s+/)
      if (words.length === 3) {
        return match[1].trim()
      }
    }
    return null
  },
}
