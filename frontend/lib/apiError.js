export async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    return null
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
    return `Cannot connect to server. Start backend API at ${apiBase}.`
  }
  return "Network error. Check your connection and try again."
}
