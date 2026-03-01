import styles from './MembershipBanner.module.css'
import Icon from './Icon'

export default function MembershipBanner({ onEnterCode = null }) {
  const handleClick = () => {
    if (onEnterCode) {
      onEnterCode()
    }
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.iconLock}><Icon name="lock" size={26} /></div>
        <div className={styles.textContent}>
          <h3 className={styles.title}>Activate Membership</h3>
          <p className={styles.subtitle}>Unlock Withdrawal + More Features</p>
        </div>
      </div>
      
      <button className={styles.cta} onClick={handleClick}>
        Enter Code
      </button>
    </div>
  )
}
