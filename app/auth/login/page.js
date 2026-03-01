"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "../../../components/Logo"
import styles from "./login.module.css"
import { loginUserLocal } from "../../../lib/localData"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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

    const result = loginUserLocal({ email: formData.email, password: formData.password })
    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Login failed" })
      setLoading(false)
      return
    }

    if (formData.rememberMe) localStorage.setItem("rememberMe", "true")
    setMessage({ type: "success", text: "Login successful. Redirecting..." })
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 700)
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
