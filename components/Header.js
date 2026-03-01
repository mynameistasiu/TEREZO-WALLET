"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "./Logo"

export default function Header() {
  const pathname = usePathname()
  const tabs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tasks" },
    { href: "/membership", label: "Activate" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <header className="header small">
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo variant="full" size={30} />
      </Link>
      <nav className="headerNav">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href} className={`headerNavBtn ${active ? "active" : ""}`}>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
