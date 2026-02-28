"use client"
import { useState } from "react"
import { API_BASE, IS_API_CONFIGURED } from "../../../config"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "../../../components/Logo"
import styles from "./login.module.css"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../../lib/apiError"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiBaseInput, setApiBaseInput] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    setLoading(true)

    if (!IS_API_CONFIGURED) {
      setMessage({ type: "error", text: "Backend not configured. Set NEXT_PUBLIC_API_BASE in deployment settings." })
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const data = await parseJsonSafe(response)

      if (!response.ok) {
        setMessage({ type: "error", text: getApiErrorMessage(data, "Login failed") })
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          isAdmin: data.user.isAdmin || false,
          isMember: data.user.isMember,
          firstName: data.user.fullName?.split(" ")[0] || "User",
          balance: data.user.balance ?? 0,
          pendingBalance: data.user.pendingBalance ?? 0,
          tasksCompleted: data.user.tasksCompleted ?? 0,
          welcomeBonusClaimed: data.user.welcomeBonusClaimed ?? false,
        })
      )
      if (formData.rememberMe) localStorage.setItem("rememberMe", "true")

      setMessage({ type: "success", text: "Login successful. Redirecting..." })
      setTimeout(() => router.push(data.user.isAdmin ? "/admin" : "/dashboard"), 900)
    } catch (error) {
      setMessage({ type: "error", text: getNetworkErrorMessage(error, API_BASE) })
    } finally {
      setLoading(false)
    }
  }

  const saveApiBase = () => {
    const normalized = apiBaseInput.trim().replace(/\/+$/, "")
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      setMessage({ type: "error", text: "Enter a valid backend URL starting with http:// or https://" })
      return
    }
    localStorage.setItem("tw_api_base", normalized)
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <aside className={styles.sidePanel}>
          <Logo variant="full" size={38} />
          <h2>Trusted wallet access</h2>
          <p>Sign in to track tasks, activate your wallet, and request withdrawals securely.</p>
          <ul>
            <li>Welcome bonus flow</li>
            <li>4-step progress tracker</li>
            <li>Secure account controls</li>
          </ul>
        </aside>

        <section className={styles.formPanel}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to continue your Terezo Wallet progress</p>

          {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

          {!IS_API_CONFIGURED && (
            <div className={`${styles.message} ${styles.error}`}>
              <div style={{ marginBottom: 8 }}>Backend API not configured on this device.</div>
              <input
                type="url"
                placeholder="https://your-backend-domain.com"
                className={styles.input}
                value={apiBaseInput}
                onChange={(e) => setApiBaseInput(e.target.value)}
              />
              <button type="button" className={styles.btnSubmit} style={{ marginTop: 10 }} onClick={saveApiBase}>
                Save Backend URL
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" name="email" className={styles.input} placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={styles.input}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.toggle} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className={styles.options}>
              <label className={styles.checkboxGroup}>
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className={styles.footerText}>
            New user? <Link href="/auth/register" className={styles.link}>Create account</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
