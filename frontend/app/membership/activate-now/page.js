"use client"
import { useState } from 'react'
import Header from '../../../components/Header'
import BottomNav from '../../../components/BottomNav'
import styles from '../membership.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE } from '../../../config'

export default function ActivateNowPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const MANUAL_PAYMENT_INFO = {
    accountName: 'Abubakar Abdullahi',
    bank: 'Opay Bank',
    accountNumber: '7382948273',
    amount: '₦10,000',
  }

  const handlePaid = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    const stored = localStorage.getItem('user')
    const userId = stored ? JSON.parse(stored).id : null
    const reference = `MANUAL_${Date.now()}`
    try {
      await fetch(`${API_BASE}/api/membership/manual-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reference, amount: 10000 }),
      })
      window.location.href = 'https://wa.me/2348039859072'
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record payment. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // redirect this page to new manual-payment route
  const router = useRouter()
  useEffect(() => {
    router.replace('/manual-payment')
  }, [router])

  return (
    <>
      <main className={styles.container}>
        <Header />

        <section className={styles.content}>
          <h1 className={styles.title}>Activate Membership</h1>
          <p className={styles.subtitle}>Activate via manual transfer</p>

          <div className={styles.benefitsCard}>
            <h3 className={styles.benefitsTitle}>Membership Benefits</h3>
            <ul className={styles.benefitsList}>
              <li>✓ Withdraw your earnings anytime</li>
              <li>✓ Access premium tasks</li>
              <li>✓ Priority support</li>
              <li>✓ Exclusive rewards</li>
            </ul>
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.tabContent}>
            <div className={styles.manualCard}>
              <h4 className={styles.manualTitle}>Bank Details</h4>
              <div className={styles.bankDetails}>
                <div className={styles.detailRow}>
                  <span>Account Name:</span>
                  <strong>{MANUAL_PAYMENT_INFO.accountName}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Bank:</span>
                  <strong>{MANUAL_PAYMENT_INFO.bank}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Account Number:</span>
                  <strong>{MANUAL_PAYMENT_INFO.accountNumber}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Amount:</span>
                  <strong>{MANUAL_PAYMENT_INFO.amount}</strong>
                </div>
              </div>

              <div className={styles.note}>
                <h5>Instructions:</h5>
                <p>1. Transfer the amount shown above to the account details</p>
                <p>2. Click "I have paid" to notify our team and open WhatsApp</p>
                <p>3. Our team will verify and approve within 24 hours</p>
              </div>

              <button
                className={styles.btnSubmit}
                onClick={handlePaid}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'I have paid'}
              </button>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
