"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MembershipActivateRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/manual-payment")
  }, [router])
  return null
}
