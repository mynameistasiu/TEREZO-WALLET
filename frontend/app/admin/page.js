"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'
import styles from './admin.module.css'
import { API_BASE } from '../../config'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [codes, setCodes] = useState([])
  const [payments, setPayments] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [submissions, setSubmissions] = useState([])

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchData = async () => {
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const [uRes, cRes, pRes, wRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/membership-codes`, { headers }),
        fetch(`${API_BASE}/api/admin/manual-payments`, { headers }),
        fetch(`${API_BASE}/api/admin/withdrawals`, { headers }),
        fetch(`${API_BASE}/api/admin/task-submissions`, { headers }),
      ])
      if (uRes.ok) setUsers(await uRes.json())
      if (cRes.ok) setCodes(await cRes.json())
      if (pRes.ok) setPayments(await pRes.json())
      if (wRes.ok) setWithdrawals(await wRes.json())
      if (sRes.ok) setSubmissions(await sRes.json())
    } catch (err) {
      console.error('Admin fetch error', err)
    }
  }

  const router = require('next/navigation').useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        if (!u.isAdmin) {
          router.push('/')
          return
        }
      } catch {}
    }
    fetchData()
  }, [])

  return (
    <>
      <main className={styles.container}>
        <Header />

        <h1 className={styles.title}>Admin Dashboard</h1>

        <section className={styles.section}>
          <h2>Users</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>Email</th><th>Admin?</th><th>Member?</th><th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? '✓' : ''}</td>
                  <td>{u.isMember ? '✓' : ''}</td>
                  <td>₦{u.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>Membership Codes</h2>
          <div className={styles.newCodeForm}>
            <input
              type="text"
              placeholder="Code"
              id="newCode"
              className={styles.input}
            />
            <button
              onClick={async () => {
                const codeInput = document.getElementById('newCode')
                const code = codeInput?.value.trim()
                if (!code) return
                try {
                  const resp = await fetch(`${API_BASE}/api/admin/membership-codes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ code }),
                  })
                  if (resp.ok) {
                    fetchData()
                    codeInput.value = ''
                  }
                } catch (err) {
                  console.error(err)
                }
              }}
              className={styles.btn}
            >Create</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Code</th><th>Active</th><th>Uses</th><th>Max</th></tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id}>
                  <td>{c.code}</td><td>{c.isActive ? 'Yes' : 'No'}</td><td>{c.uses}</td><td>{c.maxUses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>
      <BottomNav />
    </>
  )
}
