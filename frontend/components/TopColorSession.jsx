// components/TopColorSession.jsx
"use client"
import React from "react"
import Link from "next/link"

function StatusChip({ active }) {
  return (
    <span
      className={`statusChip ${active ? "active" : "inactive"}`}
      role="status"
      aria-label={`Wallet ${active ? "Active" : "Inactive"}`}
    >
      Wallet {active ? "Active" : "Inactive"}
    </span>
  )
}

function ProgressRing({ percent = 25 }) {
  // simple progress ring SVG (animated via stroke-dashoffset)
  const radius = 36
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dash = (percent / 100) * circumference
  return (
    <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius*2} ${radius*2}`}>
      <defs>
        <linearGradient id="topGoldGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#C69F3A" />
          <stop offset="100%" stopColor="#FFD66B" />
        </linearGradient>
      </defs>

      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="url(#topGoldGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform={`rotate(-90 ${radius} ${radius})`}
        style={{ transition: "stroke-dasharray 700ms ease-out" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="#fff" fontWeight="700" fontSize="14">
        {Math.round(percent)}%
      </text>
    </svg>
  )
}

export default function TopColorSession({ user = {} }) {
  // expects user = { firstName, balance, isMember, percent }
  const name = user.firstName || "User"
  const balance = typeof user.balance === "number" ? user.balance : 0
  const isMember = !!user.isMember
  const percent = typeof user.percent === "number" ? user.percent : isMember ? 100 : 25

  return (
    <section className="topColorSession">
      <div className="container">
        <div className="left">
          <div className="greetingRow">
            <h2 className="greeting">Hello, {name} <span aria-hidden>👋</span></h2>
            <StatusChip active={isMember} />
          </div>

          <div className="balanceBlock">
            <div className="balanceLabel">Available Balance</div>
            <div className="balanceValue" aria-live="polite">
              <span className="currency">₦</span>
              <span className="amount">{balance.toLocaleString()}</span>
            </div>
            <div className="smallKpis">
              <div className="kpi">
                <div className="kpiLabel">Pending</div>
                <div className="kpiVal">₦{(user.pendingBalance || 0).toLocaleString()}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Tasks</div>
                <div className="kpiVal">{user.tasksCompleted ?? 0}/4</div>
              </div>
            </div>
          </div>

          <div className="actionsRow">
            <Link href="/manual-payment" passHref legacyBehavior>
              <a className="btnPrimary" aria-label="Activate Account - manual payment">Activate Account</a>
            </Link>

            <Link href="/withdraw" passHref legacyBehavior>
              <a className={`btnSecondary ${!isMember ? "disabled" : ""}`} aria-disabled={!isMember}>Withdraw</a>
            </Link>

            <Link href="/tasks" passHref legacyBehavior>
              <a className="btnTertiary">Tasks</a>
            </Link>
          </div>
        </div>

        <div className="right">
          <div className="progressCard" aria-hidden>
            <ProgressRing percent={percent} />
            <div className="progressLabel">Complete</div>
          </div>
        </div>
      </div>
    </section>
  )
}