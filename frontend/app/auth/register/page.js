"use client"
import { useState } from "react"
import { API_BASE, IS_API_CONFIGURED } from "../../../config"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "../../../components/Logo"
import styles from "./register.module.css"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../../lib/apiError"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiBaseInput, setApiBaseInput] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))

    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++
      if (/\d/.test(value)) strength++
      if (/[^a-zA-Z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Please fill all required fields." })
      return false
    }
    if (!formData.email.includes("@")) {
      setMessage({ type: "error", text: "Enter a valid email address." })
      return false
    }
    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." })
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return false
    }
    if (!formData.agreeTerms) {
      setMessage({ type: "error", text: "You must accept Terms and Privacy Policy." })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    if (!validateForm()) return

    if (!IS_API_CONFIGURED) {
      setMessage({ type: "error", text: "Backend not configured. Set NEXT_PUBLIC_API_BASE in deployment settings." })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          referralCode: formData.referralCode || undefined,
        }),
      })

      const data = await parseJsonSafe(response)

      if (!response.ok) {
        setMessage({ type: "error", text: getApiErrorMessage(data, "Registration failed") })
        return
      }

      setMessage({ type: "success", text: "Account created successfully. Redirecting to login..." })
      setTimeout(() => router.push("/auth/login"), 1000)
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
          <h2>Start earning in minutes</h2>
          <p>Create your account to unlock the 4-step growth system and claim your welcome bonus.</p>
          <div className={styles.trustBox}>
            <h4>What you get</h4>
            <ul>
              <li>N64,000 welcome bonus popup after registration</li>
              <li>Task rewards paid to wallet balance</li>
              <li>Activation and withdrawal workflow</li>
            </ul>
          </div>
        </aside>

        <section className={styles.formPanel}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Build your Terezo Wallet profile</p>

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
            <div className={styles.double}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input type="text" name="fullName" className={styles.input} value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input type="tel" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} required />
            </div>

            <div className={styles.double}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className={styles.toggle} onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {formData.password && (
                  <div className={styles.strengthBar}>
                    <div className={`${styles.strength} ${styles[`strength${passwordStrength}`]}`} />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" className={styles.input} value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Referral Code (Optional)</label>
              <input type="text" name="referralCode" className={styles.input} value={formData.referralCode} onChange={handleChange} />
            </div>

            <label className={styles.checkboxGroup}>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className={styles.checkbox} />
              <span>
                I agree to <Link href="/terms" className={styles.link}>Terms</Link> and <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <Link href="/auth/login" className={styles.link}>Login</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
