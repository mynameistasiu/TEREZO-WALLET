export default function Icon({ name, className = '', size = 20, stroke = 'currentColor' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  switch (name) {
    case 'wallet':
      return (
        <svg {...common} className={className}>
          <rect x="2" y="6" width="16" height="12" rx="2" stroke={stroke} strokeWidth="1.5" />
          <circle cx="18.5" cy="12" r="1.5" fill={stroke} />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common} className={className}>
          <rect x="4" y="10" width="16" height="10" rx="2" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 10V8a4 4 0 118 0v2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common} className={className}>
          <path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" stroke={stroke} strokeWidth="1.5" />
        </svg>
      )
    case 'gift':
      return (
        <svg {...common} className={className}>
          <rect x="3" y="8" width="18" height="13" rx="2" stroke={stroke} strokeWidth="1.5" />
          <path d="M12 8v13" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 8c0-2 2-3 3-3s3 1 3 3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 8c0-2-2-3-3-3s-3 1-3 3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'card':
      return (
        <svg {...common} className={className}>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={stroke} strokeWidth="1.5" />
          <rect x="3" y="9" width="6" height="2" fill={stroke} />
        </svg>
      )
    case 'tasks':
      return (
        <svg {...common} className={className}>
          <path d="M9 11l3 3L22 4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common} className={className}>
          <path d="M20 6L9 17l-5-5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common} className={className}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.5" />
        </svg>
      )
    case 'eye-off':
      return (
        <svg {...common} className={className}>
          <path d="M2 12s4-7 10-7c2 0 3.5.5 4.9 1.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 3l18 18" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common} className={className} viewBox="0 0 24 24">
          <path d="M20.8 4.6c-1.8-1.7-4.6-1.6-6.3.2L12 7.2 9.5 4.9C7.8 3.2 5 3.1 3.2 4.8 1.1 6.9 1 10.1 2.6 12.3l8.9 9.5c.4.4 1 .4 1.4 0l8.9-9.5c1.6-2.2 1.5-5.4-.0-7.2z" fill={stroke} />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...common} className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke={stroke} strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="4" rx="1" stroke={stroke} strokeWidth="1.5" />
          <rect x="14" y="10" width="7" height="10" rx="1" stroke={stroke} strokeWidth="1.5" />
          <rect x="3" y="11" width="7" height="6" rx="1" stroke={stroke} strokeWidth="1.5" />
        </svg>
      )
    case 'profile':
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="8" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}
