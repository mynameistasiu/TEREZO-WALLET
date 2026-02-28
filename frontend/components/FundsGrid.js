import styles from './FundsGrid.module.css'
import Icon from './Icon'

export default function FundsGrid({ funds = [] }) {
  const defaultFunds = [
    { name: 'Task Fund', amount: 8200, icon: 'tasks', color: '#1659FF' },
    { name: 'Referral', amount: 2500, icon: 'users', color: '#13C06D' },
    { name: 'Bonus', amount: 1750, icon: 'gift', color: '#8E5CFF' },
    { name: 'Withdraw', amount: 6000, icon: 'card', color: '#C69F3A' }
  ]

  const fundsToDisplay = Array.isArray(funds) && funds.length > 0 ? funds : defaultFunds

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Your Funds</h3>
      <div className={styles.grid}>
        {fundsToDisplay.map((fund, idx) => {
          const rawAmount = fund.amount ?? fund.balance ?? fund.value ?? 0
          const numericAmount = typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/,/g, '')) || 0 : (Number(rawAmount) || 0)
          return (
            <div key={idx} className={styles.fundCard} style={{'--accent-color': fund.color}}>
              <div className={styles.iconWrapper}><Icon name={fund.icon} size={24} /></div>
              <div className={styles.content}>
                <p className={styles.fundName}>{fund.name}</p>
                <p className={styles.amount}>
                  ₦{Number(numericAmount).toLocaleString('en-NG')}
                </p>
              </div>
              <div className={styles.accent}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
