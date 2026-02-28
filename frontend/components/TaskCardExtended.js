"use client"
import styles from './TaskCardExtended.module.css'

export default function TaskCardExtended({ 
  task, 
  status = 'not-started',
  onStart,
  onSubmit,
  showVerificationNote = false 
}) {
  const statusLabels = {
    'not-started': 'Start Task',
    'pending': 'Pending Verification',
    'approved': 'Completed ✓',
    'rejected': 'Rejected'
  }

  const statusColor = {
    'not-started': '#1659FF',
    'pending': '#E8D2A1',
    'approved': '#14B866',
    'rejected': '#E02424'
  }

  return (
    <div className={styles.card} style={{ borderLeftColor: statusColor[status] }}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{task.title}</h4>
          <span className={styles.badge} style={{ backgroundColor: statusColor[status] + '20', color: statusColor[status] }}>
            {statusLabels[status]}
          </span>
        </div>
        
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.rewardBadge}>
          <strong>₦{task.reward?.toLocaleString()}</strong> reward
        </div>

        {showVerificationNote && (
          <p className={styles.note}>✓ After you complete, we'll verify and credit your reward.</p>
        )}
      </div>

      <div className={styles.actions}>
        {status === 'not-started' && (
          <button className={styles.btnPrimary} onClick={onStart}>
            Start Task
          </button>
        )}
        {status === 'pending' && (
          <button className={styles.btnSecondary} disabled>
            Awaiting Approval
          </button>
        )}
        {status === 'approved' && (
          <span className={styles.approvedBadge}>Completed</span>
        )}
        {status === 'rejected' && (
          <button className={styles.btnDanger}>Retry</button>
        )}
      </div>
    </div>
  )
}
