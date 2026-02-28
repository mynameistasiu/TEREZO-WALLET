export default function Logo({ variant = "full", size = 48 }) {
  if (variant === "monogram") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TW logo">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#0B2545" />
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#twGlow)" opacity="0.15" />
        <path d="M13 18H35" stroke="#FFD66B" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 18V44" stroke="#FFD66B" strokeWidth="5" strokeLinecap="round" />
        <path d="M34 21L39 44L46 29L53 44L58 21" stroke="#C69F3A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="twGlow" x1="2" y1="2" x2="62" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD66B" />
            <stop offset="1" stopColor="#C69F3A" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Logo variant="monogram" size={size} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: Math.max(15, size * 0.34), fontWeight: 800, color: "#0B2545", fontFamily: "Poppins, sans-serif" }}>Terezo Wallet</div>
        <div style={{ fontSize: Math.max(10, size * 0.2), fontWeight: 600, color: "#6B7280" }}>Trusted digital reward wallet</div>
      </div>
    </div>
  )
}
