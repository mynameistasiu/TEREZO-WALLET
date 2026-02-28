// shared frontend configuration/constants
const trimTrailingSlash = (url = "") => String(url).replace(/\/+$/, "")

const envApiBase = trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE || "")

const inferredApiBase = (() => {
  if (typeof window === "undefined") return ""
  const host = window.location.hostname
  const isLocalHost = host === "localhost" || host === "127.0.0.1"
  // In local dev, default to local backend.
  if (isLocalHost) return "http://localhost:5000"
  // In deployed environments, don't force localhost.
  return ""
})()

export const API_BASE = envApiBase || inferredApiBase
export const MEMBERSHIP_FEE = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_FEE) || 10000
export const WELCOME_BONUS = parseInt(process.env.NEXT_PUBLIC_WELCOME_BONUS) || 64000
