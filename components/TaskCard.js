import styles from './TaskCard.module.css'
import Icon from './Icon'

export default function TaskCard({ 
  icon = 'tasks', 
  title = 'Share on Telegram',
  reward = 150,
  completed = false,
  onStart = null 
}) {
  const handleClick = () => {
    if (onStart) {
      onStart()
    }
  }

  return (
    <div className={`${styles.card} ${completed ? styles.completed : ''}`}>
      <div className={styles.left}>
        <div className={styles.icon}><Icon name={icon} size={20} /></div>
        <div className={styles.content}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.reward}>
            <span className={styles.rewardIcon}><Icon name="heart" size={14} /></span>
            <span className={styles.rewardAmount}>₦{reward.toLocaleString('en-NG')}</span>
          </div>
        </div>
      </div>

      {completed ? (
        <div className={styles.checkmark}><Icon name="check" size={16} /></div>
      ) : (
        <button className={styles.cta} onClick={handleClick}>
          Start
        </button>
      )}
    </div>
  )
}
