'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'
import Icon from './Icon'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard', alt: 'Dashboard' },
    { href: '/tasks', label: 'Tasks', icon: 'tasks', alt: 'Tasks' },
    { href: '/membership', label: 'Activate', icon: 'lock', alt: 'Activate' },
    { href: '/profile', label: 'Profile', icon: 'profile', alt: 'Profile' }
  ]

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContent}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href} className={`${styles.tab} ${isActive ? styles.active : ''}`}>
              <span className={styles.icon}><Icon name={tab.icon} size={20} /></span>
              <span className={styles.label}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
