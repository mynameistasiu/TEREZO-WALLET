const USERS_KEY = "tw_users"
const USER_KEY = "user"
const TOKEN_KEY = "token"
const TX_KEY = "tw_local_transactions"

const nowIso = () => new Date().toISOString()

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const ensureUsersStore = () => {
  const users = readJson(USERS_KEY, [])
  if (Array.isArray(users)) return users
  writeJson(USERS_KEY, [])
  return []
}

export const getAllUsers = () => ensureUsersStore()

export const registerUserLocal = ({ fullName, email, phone, password, referralCode }) => {
  const users = ensureUsersStore()
  const normalizedEmail = String(email || "").trim().toLowerCase()
  if (!normalizedEmail) return { ok: false, error: "Email is required" }
  if (users.some((u) => String(u.email).toLowerCase() === normalizedEmail)) {
    return { ok: false, error: "Email already registered" }
  }
  const maxId = users.reduce((m, u) => Math.max(m, Number(u.id || 0)), 0)
  const firstName = String(fullName || "").trim().split(" ")[0] || "User"
  const user = {
    id: maxId + 1,
    email: normalizedEmail,
    phone: String(phone || "").trim(),
    password: String(password || ""),
    fullName: String(fullName || "").trim(),
    firstName,
    isMember: false,
    balance: 0,
    pendingBalance: 0,
    welcomeBonusClaimed: false,
    tasksCompleted: 0,
    kycStatus: "unverified",
    referredBy: referralCode || null,
    createdAt: nowIso(),
  }
  const next = [user, ...users]
  writeJson(USERS_KEY, next)
  return { ok: true, user }
}

export const loginUserLocal = ({ email, password }) => {
  const users = ensureUsersStore()
  const normalizedEmail = String(email || "").trim().toLowerCase()
  const found = users.find((u) => String(u.email).toLowerCase() === normalizedEmail)
  if (!found) return { ok: false, error: "User not found" }
  if (String(found.password) !== String(password || "")) return { ok: false, error: "Invalid password" }
  const token = `local-${found.id}-${Date.now()}`
  localStorage.setItem(TOKEN_KEY, token)
  const safeUser = { ...found }
  delete safeUser.password
  writeJson(USER_KEY, safeUser)
  return { ok: true, token, user: safeUser }
}

export const getCurrentUser = () => readJson(USER_KEY, null)

export const updateUserById = (id, patch) => {
  const users = ensureUsersStore()
  const next = users.map((u) => (Number(u.id) === Number(id) ? { ...u, ...patch } : u))
  writeJson(USERS_KEY, next)
  const current = getCurrentUser()
  if (current && Number(current.id) === Number(id)) {
    writeJson(USER_KEY, { ...current, ...patch })
  }
  return next.find((u) => Number(u.id) === Number(id)) || null
}

export const addLocalTransaction = (tx) => {
  const items = readJson(TX_KEY, [])
  const next = [{ id: `local-${Date.now()}`, createdAt: nowIso(), ...tx }, ...items].slice(0, 60)
  writeJson(TX_KEY, next)
  return next
}

export const getLocalTransactions = () => readJson(TX_KEY, [])
