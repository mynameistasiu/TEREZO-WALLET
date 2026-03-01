import '../styles/globals.css'

export const metadata = {
  title: 'Terezo Wallet',
  description: 'Task-based wallet and light e-commerce',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  )
}
