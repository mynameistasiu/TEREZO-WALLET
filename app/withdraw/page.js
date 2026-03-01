"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./withdraw.module.css"
import { addLocalTransaction, updateUserById } from "../../lib/localData"

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
  const [hasActivatedOnce, setHasActivatedOnce] = useState(false)
  const [formData, setFormData] = useState({ bankName: "", accountName: "", accountNumber: "", amount: "" })
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successText, setSuccessText] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })

  const ensureMembershipReady = async (baseUser) => {
    if (!baseUser?.id) return { ok: false, reason: "User not found. Please login again." }
    if (baseUser.isMember || hasActivatedOnce || localStorage.getItem("tw_wallet_activated") === "1") {
      const merged = { ...baseUser, isMember: true }
      setUser(merged)
      localStorage.setItem("user", JSON.stringify(merged))
      updateUserById(merged.id, merged)
      localStorage.setItem("tw_wallet_activated", "1")
      setHasActivatedOnce(true)
      return { ok: true, user: merged }
    }
    return { ok: false, reason: "Membership required. Activate wallet first." }
  }

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) return

    const parsed = JSON.parse(stored)
    const activatedFlag = localStorage.getItem("tw_wallet_activated") === "1"
    setHasActivatedOnce(activatedFlag || Boolean(parsed.isMember))
    setUser(parsed)

    if (!parsed.id) return
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const ready = await ensureMembershipReady(user)
    if (!ready.ok) {
      setMessage({ type: "error", text: ready.reason })
      setLoading(false)
      return
    }

    const effectiveUser = ready.user || user
    const amountValue = parseNairaInput(formData.amount)

    if (amountValue > Number(effectiveUser.balance)) {
      setMessage({ type: "error", text: "Insufficient balance." })
      setLoading(false)
      return
    }

    try {
      setProcessing(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const nextBalance = Math.max(0, Number(effectiveUser.balance || 0) - amountValue)
      const updatedUser = { ...effectiveUser, balance: nextBalance, isMember: true }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      updateUserById(updatedUser.id, updatedUser)
      addLocalTransaction({
        type: "WITHDRAWAL_REQUEST",
        amount: -amountValue,
        meta: `${formData.bankName} ${formData.accountNumber}`,
      }, updatedUser.id)

      setSuccessText(`Your withdrawal of ${formatCurrency(amountValue)} was submitted successfully.`)
      setShowSuccessPopup(true)
      setMessage({ type: "success", text: "Withdrawal request submitted. Processing window: 10-15 Minutes." })
      setFormData({ bankName: "", accountName: "", accountNumber: "", amount: "" })
    } catch {
      setMessage({ type: "error", text: "Error processing withdrawal" })
    } finally {
      setProcessing(false)
      setLoading(false)
    }
  }

  return (
    <>
      <main className={styles.container}>
        <Header />

        <section className={styles.content}>
            <h1 className={styles.title}>Withdraw Funds</h1>
            <p className={styles.subtitle}>Fill your bank details correctly. Approved requests are sent to your account after review.</p>

            <div className={styles.statusCard}>
              <span>Wallet Status</span>
              <strong className={user.isMember || hasActivatedOnce ? styles.activeStatus : styles.inactiveStatus}>
                {user.isMember || hasActivatedOnce ? "Active" : "Inactive"}
              </strong>
              <small>Available Balance: {formatCurrency(user.balance)}</small>
            </div>

            {!user.isMember && !hasActivatedOnce && (
              <div className={`${styles.message} ${styles.error}`}>
                Wallet not active yet. You can still submit; system will attempt automatic activation first.{" "}
                <Link href="/membership" className={styles.btnActivate}>Open Activation</Link>
              </div>
            )}

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
