"use client"
import styles from "./WelcomePopup.module.css"

export default function WelcomePopup({ userName = "User", onClaim, onLater, isOpen = true, isClaiming = false, error = "" }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Welcome, {userName}</h2>
        <p className={styles.message}>
          You have received a <strong>N64,000 welcome bonus</strong> from Terezo Wallet. Click claim to credit your wallet balance now.
        </p>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onClaim} disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim Bonus"}
          </button>
          <button className={styles.btnSecondary} onClick={onLater} disabled={isClaiming}>
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
