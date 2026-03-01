"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ActivateNowRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/manual-payment")
  }, [router])
  return null
}
