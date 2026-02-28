"use client"
import { useState, useEffect } from "react"
import { API_BASE } from "../../config"
import Link from "next/link"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./withdraw.module.css"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../lib/apiError"

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value)

const formatNairaInput = (value = "") => {
  const digits = String(value).replace(/\D/g, "")
  if (!digits) return ""
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const parseNairaInput = (value = "") => Number(String(value).replace(/,/g, "")) || 0

export default function WithdrawPage() {
  const [user, setUser] = useState({ isMember: false, balance: 0, id: null })
  const [formData, setFormData] = useState({ bankName: "", accountName: "", accountNumber: "", amount: "" })
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successText, setSuccessText] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) return

    const parsed = JSON.parse(stored)
    setUser(parsed)

    if (parsed.id) {
      fetch(`${API_BASE}/api/user/${parsed.id}/dashboard`)
        .then((r) => r.json())
        .then((data) => {
          if (!data || !data.id) return
          const synced = { ...parsed, isMember: Boolean(data.isMember), balance: Number(data.balance || 0) }
          setUser((prev) => ({ ...prev, ...synced }))
          localStorage.setItem("user", JSON.stringify(synced))
        })
        .catch(() => {})
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    if (!user.isMember) {
      setMessage({ type: "error", text: "Wallet is inactive. Activate account before withdrawing." })
      setLoading(false)
      return
    }

    const amountValue = parseNairaInput(formData.amount)

    if (amountValue > Number(user.balance)) {
      setMessage({ type: "error", text: "Insufficient balance." })
      setLoading(false)
      return
    }

    try {
      setProcessing(true)
      const [response] = await Promise.all([
        fetch(`${API_BASE}/api/withdraw`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, ...formData, amount: amountValue }),
        }),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ])
      const data = await parseJsonSafe(response)

      if (!response.ok) {
        const apiMsg = getApiErrorMessage(data, "Error processing withdrawal")
        const mapped = apiMsg === "Membership required to withdraw" ? "Wallet is inactive. Activate account before withdrawing." : apiMsg
        setMessage({ type: "error", text: mapped })
        return
      }

      const nextBalance = Number.isFinite(Number(data.newBalance)) ? Number(data.newBalance) : Math.max(0, Number(user.balance || 0) - amountValue)
      const updatedUser = { ...user, balance: nextBalance, isMember: data.isMember ?? user.isMember }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setSuccessText(`Your withdrawal of ${formatCurrency(amountValue)} was submitted successfully.`)
      setShowSuccessPopup(true)
      setMessage({ type: "success", text: "Withdrawal request submitted. Processing window: 24-72 hours." })
      setFormData({ bankName: "", accountName: "", accountNumber: "", amount: "" })
    } catch (error) {
      setMessage({ type: "error", text: getNetworkErrorMessage(error, API_BASE) })
    } finally {
      setProcessing(false)
      setLoading(false)
    }
  }

  return (
    <>
      <main className={styles.container}>
        <Header />

        {!user.isMember && (
          <section className={styles.gatingSection}>
            <div className={styles.gatingCard}>
              <h2 className={styles.gatingTitle}>Wallet Inactive</h2>
              <p className={styles.gatingText}>Your wallet must be active before withdrawal is enabled.</p>
              <Link href="/manual-payment" className={styles.btnActivate}>Activate Account</Link>
            </div>
          </section>
        )}

        {user.isMember && (
          <section className={styles.content}>
            <h1 className={styles.title}>Withdraw Funds</h1>
            <p className={styles.subtitle}>Fill your bank details correctly. Approved requests are sent to your account after review.</p>

            <div className={styles.statusCard}>
              <span>Wallet Status</span>
              <strong className={styles.activeStatus}>Active</strong>
              <small>Available Balance: {formatCurrency(user.balance)}</small>
            </div>

            {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bank Name</label>
                <select name="bankName" className={styles.input} value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required>
                  <option value="">Select Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Citibank Nigeria">Citibank Nigeria</option>
                  <option value="Ecobank Nigeria">Ecobank Nigeria</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="First City Monument Bank">First City Monument Bank (FCMB)</option>
                  <option value="Globus Bank">Globus Bank</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTBank)</option>
                  <option value="Heritage Bank">Heritage Bank</option>
                  <option value="Keystone Bank">Keystone Bank</option>
                  <option value="Lotus Bank">Lotus Bank</option>
                  <option value="Jaiz Bank">Jaiz Bank</option>
                  <option value="Parallex Bank">Parallex Bank</option>
                  <option value="Polaris Bank">Polaris Bank</option>
                  <option value="Providus Bank">Providus Bank</option>
                  <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                  <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                  <option value="Sterling Bank">Sterling Bank</option>
                  <option value="SunTrust Bank">SunTrust Bank</option>
                  <option value="TAJ Bank">TAJ Bank</option>
                  <option value="Titan Trust Bank">Titan Trust Bank</option>
                  <option value="Union Bank">Union Bank</option>
                  <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
                  <option value="Unity Bank">Unity Bank</option>
                  <option value="Wema Bank">Wema Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="Opay">Opay</option>
                  <option value="Moniepoint MFB">Moniepoint MFB</option>
                  <option value="Kuda MFB">Kuda MFB</option>
                  <option value="PalmPay">PalmPay</option>
                  <option value="VFD MFB">VFD MFB</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Name</label>
                <input type="text" name="accountName" className={styles.input} value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Number</label>
                <input type="text" name="accountNumber" className={styles.input} value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Amount (NGN)</label>
                <input
                  type="text"
                  name="amount"
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="e.g. 25,000"
                  value={formData.amount}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, "")
                    setFormData({ ...formData, amount: formatNairaInput(rawDigits) })
                  }}
                  required
                />
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading || processing}>
                {loading || processing ? "Processing..." : "Request Withdrawal"}
              </button>
            </form>
          </section>
        )}
      </main>

      {processing && (
        <div className={styles.overlay}>
          <div className={styles.loaderCard}>
            <span className={styles.loader} />
            <p>Processing your withdrawal request...</p>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className={styles.overlay}>
          <div className={styles.successCard}>
            <h3>Withdrawal Successful</h3>
            <p>{successText}</p>
            <button type="button" className={styles.btnSubmit} onClick={() => setShowSuccessPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </>
  )
}
