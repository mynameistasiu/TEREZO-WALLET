export async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    try {
      const text = await response.text()
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch {
        return { error: text }
      }
    } catch {
      return null
    }
  }
}

export function getApiErrorMessage(data, fallback = "Request failed") {
  if (!data) return fallback
  if (typeof data.error === "string" && data.error.trim()) return data.error
  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0]
    if (typeof first === "string" && first.trim()) return first
  }
  return fallback
}

export function getNetworkErrorMessage(error, apiBase) {
  const raw = (error && error.message) || ""
  if (raw.toLowerCase().includes("failed to fetch")) {
    if (apiBase) return `Cannot connect to server. Check API endpoint: ${apiBase}.`
    return "Cannot connect to server. Backend API URL is not configured."
  }
  return "Network error. Check your connection and try again."
}
