"use client"
import { useState } from 'react'
import styles from './HeroWalletCard.module.css'
import Icon from './Icon'

export default function HeroWalletCard({ balance = 18450, percentFilled = 70, userName = 'Tasiu' }) {
  const [showBalance, setShowBalance] = useState(true)
  const formattedBalance = balance.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 })

  return (
    <div className={styles.heroCard}>
      {/* Left Content */}
      <div className={styles.leftContent}>
        <div className={styles.greeting}>Hello, {userName} <span style={{opacity:0.95}}>👋</span></div>
        
        <div className={styles.chip}>
          <span className={styles.dot}></span>
          Wallet Active
        </div>

        <div className={styles.balanceSection}>
          <label className={styles.label}>Total Balance</label>
          <div className={styles.balanceRow}>
            {showBalance ? (
              <div className={styles.numeric}>{formattedBalance}</div>
            ) : (
              <div className={styles.masked}>••••••</div>
            )}
            <button 
              className={styles.eyeToggle}
              onClick={() => setShowBalance(!showBalance)}
              aria-label="Toggle balance visibility"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <Icon name="eye" size={18} /> : <Icon name="eye-off" size={18} />}
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <button className={`${styles.btn} ${styles.deposit}`}>
            Deposit
          </button>
          <button className={`${styles.btn} ${styles.withdraw}`}>
            Withdraw
          </button>
        </div>
      </div>

      {/* Right Content - Progress Ring */}
      <div className={styles.rightContent}>
        <img src="/icons/wallet.svg" alt="wallet illustration" className={styles.walletIllustration} />
        <svg 
          className={styles.progressRing} 
          viewBox="0 0 200 200"
          width="140"
          height="140"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C69F3A" />
              <stop offset="100%" stopColor="#FFD66B" />
            </linearGradient>
          </defs>
          
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="8"
            strokeDasharray={`${(percentFilled / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
            strokeLinecap="round"
            className={styles.animatedRing}
            transform="rotate(-90 100 100)"
          />

          {/* Center text */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dy="0.3em"
            fill="white"
            fontSize="32"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            {percentFilled}%
          </text>
          
          <text
            x="100"
            y="135"
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="12"
            fontFamily="Inter, sans-serif"
          >
            Progress
          </text>
        </svg>
      </div>
    </div>
  )
}
