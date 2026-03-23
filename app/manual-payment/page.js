"use client"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./manual-payment.module.css"

const PAYMENT = {
  accountNumber: "6511699109",
  accountName: "Abdulrahim Usman",
  bank: "Moniepoint MFB",
  amount: 6000,
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value)

export default function ManualPaymentPage() {
  const handlePaymentDone = () => {
    const proofText = encodeURIComponent(
      `Hello Admin, I have made activation payment.\nAmount: ${formatCurrency(PAYMENT.amount)}\nBank: ${PAYMENT.bank}\nAccount Number: ${PAYMENT.accountNumber}\nPlease verify and send my activation code.`
    )
    window.location.href = `https://wa.me/‪2347076196687‬text=${proofText}`
  }

  return (
    <>
      <main className={styles.container}>
        <Header />
        <section className={styles.content}>
          <h1 className={styles.title}>Purchase Activation Code</h1>
          <p className={styles.subtitle}>Transfer the exact amount below, then click the button to send payment proof on WhatsApp.</p>

          <article className={styles.checkoutCard}>
            <h3>Checkout Summary</h3>
            <div className={styles.row}><span>Product</span><strong>Terezo Wallet Activation Code</strong></div>
            <div className={styles.row}><span>Amount</span><strong>{formatCurrency(PAYMENT.amount)}</strong></div>
            <div className={styles.row}><span>Status</span><strong>Awaiting Payment</strong></div>
          </article>

          <article className={styles.paymentCard}>
            <h3>Manual Payment Details</h3>
            <div className={styles.row}><span>Account Number</span><strong>{PAYMENT.accountNumber}</strong></div>
            <div className={styles.row}><span>Account Name</span><strong>{PAYMENT.accountName}</strong></div>
            <div className={styles.row}><span>Bank</span><strong>{PAYMENT.bank}</strong></div>
            <div className={styles.row}><span>Amount</span><strong>{formatCurrency(PAYMENT.amount)}</strong></div>
            <small>After transfer, click the button below and send your screenshot/proof in WhatsApp.</small>
          </article>

          <div className={styles.formCard}>
            <button className={styles.btnPrimary} onClick={handlePaymentDone}>I Have Made Payment</button>
            <a href="/membership/activate-code" className={styles.secondaryLink}>I already have my activation code</a>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
