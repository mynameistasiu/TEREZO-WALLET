"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Logo from "./Logo"

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) return
    try {
      const user = JSON.parse(stored)
      setIsAdmin(Boolean(user.isAdmin))
    } catch {
      setIsAdmin(false)
    }
  }, [])

  return (
    <header className="header small">
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo variant="full" size={30} />
      </Link>
      <nav className="headerNav" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/tasks">Tasks</Link>
        <Link href="/membership">Activate</Link>
        {isAdmin && <Link href="/admin">Admin</Link>}
        <Link href="/profile">Profile</Link>
      </nav>
    </header>
  )
}
