"use client"
import styles from './ProgressTrackerLinear.module.css'

export default function ProgressTracker({ currentStep = 0 }) {
  const steps = [
    { label: 'Register', num: 1 },
    { label: 'Tasks', num: 2 },
    { label: 'Activate', num: 3 },
    { label: 'Withdraw', num: 4 },
  ]

  const percentage = (currentStep / 4) * 100

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.filled} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className={styles.stepsContainer}>
        {steps.map((step, i) => (
          <div key={i} className={`${styles.step} ${i < currentStep ? styles.completed : i === currentStep ? styles.active : ''}`}>
            <div className={styles.circle}>
              {i < currentStep ? '✓' : step.num}
            </div>
            <div className={styles.label}>{step.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.percentText}>{percentage}% Complete</div>
    </div>
  )
}
