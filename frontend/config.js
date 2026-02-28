// shared frontend configuration/constants
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'
export const MEMBERSHIP_FEE = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_FEE) || 10000
export const WELCOME_BONUS = parseInt(process.env.NEXT_PUBLIC_WELCOME_BONUS) || 64000
