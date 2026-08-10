import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import './admindashboard.css'
import Swal from 'sweetalert2'
import { motion, AnimatePresence } from 'framer-motion'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import {
  MdClose, MdDashboard, MdPeople, MdSettings, MdLogout, MdMenu,
  MdMoreVert, MdAttachMoney, MdUpgrade, MdCheckCircle, MdBarChart,
  MdEmail, MdDelete, MdTrendingUp, MdTrendingDown, MdSearch,
  MdSwapHoriz, MdShowChart, MdRefresh, MdFileDownload, MdPersonAdd,
  MdArrowUpward, MdArrowDownward, MdChevronLeft, MdChevronRight,
  MdWarningAmber, MdInbox, MdContentCopy
} from 'react-icons/md'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

/* ============================================================
   Constants
   ============================================================ */
const PAGE_SIZE = 10
const SESSION_KEY = 've_admin_session'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAILJS_CONFIG = {
  service_id: 'service_zct33mb',
  template_id: 'template_qra6u7l',
  user_id: 'md-uhxzM-qX_OjH_m',
  reply_to: 'vaultexpertgroup@gmail.com'
}

/* ============================================================
   Formatting / parsing helpers
   ============================================================ */
const toNumber = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(/[$,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const money = (value, decimals = 2) =>
  toNumber(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

/**
 * Parses the amount typed by an admin into a safe positive number.
 * Returns null when the input is not a usable amount, so callers can
 * refuse to submit instead of sending NaN / "" / negative values.
 */
const parseAmount = (raw) => {
  const cleaned = String(raw ?? '').replace(/[$,\s]/g, '')
  if (cleaned === '') return null
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

/** Accepts ISO strings, timestamps and dd/mm/yyyy or mm/dd/yyyy strings. */
const parseDate = (raw) => {
  if (!raw) return null
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw
  const text = String(raw).trim()
  const direct = new Date(text)
  if (!Number.isNaN(direct.getTime())) return direct
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (match) {
    const built = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
    return Number.isNaN(built.getTime()) ? null : built
  }
  return null
}

const formatDate = (raw) => {
  const date = parseDate(raw)
  if (!date) return raw ? String(raw) : '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const fullName = (user) =>
  [user?.firstname ?? user?.firstName, user?.lastname ?? user?.lastName].filter(Boolean).join(' ') || '—'

const initials = (user) => {
  const first = (user?.firstname ?? user?.firstName ?? '').charAt(0)
  const last = (user?.lastname ?? user?.lastName ?? '').charAt(0)
  return `${first}${last}`.toUpperCase() || 'U'
}

const downloadCsv = (filename, columns, rows) => {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const header = columns.map((column) => escape(column.label)).join(',')
  const body = rows
    .map((row) => columns.map((column) => escape(column.csv ? column.csv(row) : row[column.key])).join(','))
    .join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ============================================================
   Presentational sub-components (module level so they never remount)
   ============================================================ */
const Sparkline = ({ points, tone = 'primary' }) => {
  const values = points.length ? points : [0]
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const step = values.length > 1 ? 100 / (values.length - 1) : 100
  const coords = values.map((value, index) => [index * step, 30 - ((value - min) / range) * 26])
  const line = coords.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L100,32 L0,32 Z`
  return (
    <svg className={`sparkline tone-${tone}`} viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <path className="sparkline-area" d={area} />
      <path className="sparkline-line" d={line} />
    </svg>
  )
}

const StatCard = ({ icon, tone, label, value, caption, delta, series }) => (
  <div className={`stat-card tone-${tone}`}>
    <div className="stat-card-top">
      <span className="stat-icon">{icon}</span>
      {delta !== undefined && delta !== null && (
        <span className={`stat-delta ${delta >= 0 ? 'up' : 'down'}`}>
          {delta >= 0 ? <MdArrowUpward /> : <MdArrowDownward />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      )}
    </div>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {caption && <p className="stat-caption">{caption}</p>}
    {series && <Sparkline points={series} tone={tone} />}
  </div>
)

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="chart-tooltip-row">
          <span className="dot" style={{ background: entry.color }} />
          <span className="name">{entry.name}</span>
          <span className="value">{money(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}

const EmptyState = ({ icon, title, text, action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
    {action}
  </div>
)

const TableSkeleton = ({ columns }) => (
  <tbody>
    {Array.from({ length: 6 }).map((_, rowIndex) => (
      <tr key={rowIndex} className="skeleton-row">
        {columns.map((column) => (
          <td key={column.key}>
            <span className="skeleton-bar" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
)

/**
 * Sortable + paginated table shared by every list view.
 */
const DataTable = ({
  title,
  subtitle,
  columns,
  rows,
  loading,
  emptyIcon,
  emptyTitle,
  emptyText,
  emptyAction,
  toolbar
}) => {
  const [sort, setSort] = useState({ key: null, direction: 'desc' })
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [rows.length, sort.key, sort.direction])

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows
    const column = columns.find((item) => item.key === sort.key)
    if (!column) return rows
    const read = column.sortValue || ((row) => row[column.key])
    return [...rows].sort((a, b) => {
      const left = read(a)
      const right = read(b)
      let result
      if (typeof left === 'number' && typeof right === 'number') {
        result = left - right
      } else {
        result = String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true })
      }
      return sort.direction === 'asc' ? result : -result
    })
  }, [rows, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visibleRows = sortedRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSort = (column) => {
    if (column.sortable === false) return
    setSort((current) =>
      current.key === column.key
        ? { key: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key: column.key, direction: 'desc' }
    )
  }

  const showEmpty = !loading && rows.length === 0

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="panel-actions">
          {toolbar}
          <span className="pill">{rows.length} {rows.length === 1 ? 'record' : 'records'}</span>
        </div>
      </header>

      {showEmpty ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} text={emptyText} action={emptyAction} />
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={[
                        column.align === 'right' ? 'align-right' : '',
                        column.sortable === false ? '' : 'sortable',
                        sort.key === column.key ? 'sorted' : ''
                      ].join(' ').trim()}
                      onClick={() => toggleSort(column)}
                    >
                      <span className="th-inner">
                        {column.label}
                        {sort.key === column.key && (
                          sort.direction === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton columns={columns} />
              ) : (
                <tbody>
                  {visibleRows.map((row, index) => (
                    <tr key={row.__key ?? index}>
                      {columns.map((column) => (
                        <td key={column.key} className={column.align === 'right' ? 'align-right' : ''}>
                          {column.render ? column.render(row) : row[column.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {pageCount > 1 && (
            <footer className="panel-footer">
              <span className="page-info">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sortedRows.length)} of {sortedRows.length}
              </span>
              <div className="pager">
                <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
                  <MdChevronLeft />
                </button>
                <span className="page-current">{safePage} / {pageCount}</span>
                <button type="button" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>
                  <MdChevronRight />
                </button>
              </div>
            </footer>
          )}
        </>
      )}
    </section>
  )
}

const Modal = ({ title, description, onClose, children, footer, variant = '', wide = false }) => (
  <motion.div
    className="modal-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}
  >
    <motion.div
      className={`modal ${variant} ${wide ? 'modal-wide' : ''}`}
      initial={{ y: 24, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 16, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <div className="modal-header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
          <MdClose />
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </motion.div>
  </motion.div>
)

/* ============================================================
   Main component
   ============================================================ */
const Admindashboard = ({ route }) => {
  const navigate = useNavigate()

  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3200,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }),
    []
  )

  const notifySuccess = useCallback((title) => Toast.fire({ icon: 'success', title }), [Toast])
  const notifyError = useCallback((title) => Toast.fire({ icon: 'error', title }), [Toast])

  /* ---------------- auth ---------------- */
  const [authed, setAuthed] = useState(() => Boolean(sessionStorage.getItem(SESSION_KEY)))
  const [adminEmail, setAdminEmail] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)

  /* ---------------- data ---------------- */
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  /* ---------------- chrome ---------------- */
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [searchTerm, setSearchTerm] = useState('')
  const [openRowMenu, setOpenRowMenu] = useState(null)
  const [revealedPasswords, setRevealedPasswords] = useState({})
  const menuRootRef = useRef(null)

  /* ---------------- modal + forms ---------------- */
  // A single modal descriptor prevents the cross-talk that the previous
  // five independent booleans + one shared amount field allowed.
  const [modal, setModal] = useState(null) // { type, user }
  const [busy, setBusy] = useState(false)
  const [amountInput, setAmountInput] = useState('')
  const [statsForm, setStatsForm] = useState({ totalprofit: '', refBonus: '', totaldeposit: '', totalwithdraw: '' })
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', userName: '', email: '', password: '' })
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null)

  /* ---------------- settings ---------------- */
  const [adminNewEmail, setAdminNewEmail] = useState('')
  const [adminNewPassword, setAdminNewPassword] = useState('')
  const [updatingAdmin, setUpdatingAdmin] = useState(false)

  /* ============================================================
     API helper — every call goes through here so a network failure,
     an HTML error page or a non-JSON body can never leave the UI
     stuck on a spinner.
     ============================================================ */
  const api = useCallback(async (path, body, method = 'POST') => {
    let response
    try {
      response = await fetch(`${route}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(method === 'GET' ? {} : { body: JSON.stringify(body ?? {}) })
      })
    } catch (error) {
      throw new Error('Network error — check your connection and try again.')
    }
    const text = await response.text()
    let payload
    try {
      payload = text ? JSON.parse(text) : {}
    } catch (error) {
      throw new Error(`Server returned an unexpected response (${response.status}).`)
    }
    if (!response.ok && payload?.status === undefined) {
      throw new Error(payload?.message || payload?.error || `Request failed (${response.status}).`)
    }
    return payload
  }, [route])

  /** EmailJS is a best-effort side effect: it must never mask a
   *  successful ledger operation or abort the refresh that follows. */
  const sendMail = useCallback(async ({ name, email, message, subject }) => {
    try {
      const response = await fetch(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.service_id,
          template_id: EMAILJS_CONFIG.template_id,
          user_id: EMAILJS_CONFIG.user_id,
          template_params: {
            name: String(name ?? ''),
            email: String(email ?? ''),
            message: String(message ?? ''),
            reply_to: EMAILJS_CONFIG.reply_to,
            subject: String(subject ?? '')
          }
        })
      })
      return response.ok
    } catch (error) {
      return false
    }
  }, [])

  /* ============================================================
     Fetching
     ============================================================ */
  const fetchUsers = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    else setLoadingUsers(true)
    try {
      const payload = await api('/api/getUsers', null, 'GET')
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.users) ? payload.users : []
      setUsers(list)
      return list
    } catch (error) {
      notifyError(error.message)
      setUsers((current) => current)
      return null
    } finally {
      setLoadingUsers(false)
      setRefreshing(false)
    }
  }, [api, notifyError])

  useEffect(() => {
    if (authed) fetchUsers()
  }, [authed, fetchUsers])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRootRef.current && !menuRootRef.current.contains(event.target)) setOpenRowMenu(null)
    }
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpenRowMenu(null)
      if (!busy) setModal(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [busy])

  /* ============================================================
     Derived data
     ============================================================ */
  const flattenLedger = useCallback(
    (field) =>
      users
        .flatMap((user) =>
          (Array.isArray(user?.[field]) ? user[field] : []).map((entry, index) => ({
            ...entry,
            __key: `${user.email}-${field}-${entry?.id ?? index}`,
            userName: fullName(user),
            userEmail: user.email,
            userInitials: initials(user),
            amountValue: toNumber(entry?.amount),
            dateValue: parseDate(entry?.date ?? entry?.startDate)?.getTime() ?? 0
          }))
        )
        .sort((a, b) => b.dateValue - a.dateValue),
    [users]
  )

  const deposits = useMemo(() => flattenLedger('deposit'), [flattenLedger])
  const withdrawals = useMemo(() => flattenLedger('withdraw'), [flattenLedger])
  // /api/getUsers returns raw user documents, where the array is `investment`.
  // (Only the user-facing /api/getData renames it to `invest`, so don't be
  // misled by the dashboard pages.) Accept either shape defensively.
  const trades = useMemo(
    () => (users.some((user) => Array.isArray(user?.investment))
      ? flattenLedger('investment')
      : flattenLedger('invest')),
    [flattenLedger, users]
  )

  const totals = useMemo(() => {
    const balance = users.reduce((sum, user) => sum + toNumber(user.funded), 0)
    const profit = users.reduce((sum, user) => sum + toNumber(user.totalprofit), 0)
    const deposited = users.reduce((sum, user) => sum + toNumber(user.totaldeposit), 0)
    const withdrawn = users.reduce((sum, user) => sum + toNumber(user.totalwithdraw), 0)
    const referral = users.reduce((sum, user) => sum + toNumber(user.refBonus), 0)
    return { balance, profit, deposited, withdrawn, referral }
  }, [users])

  const series = useMemo(() => {
    const days = []
    for (let offset = 13; offset >= 0; offset -= 1) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - offset)
      days.push(dayKey(date))
    }
    const bucket = (entries) => {
      const map = new Map(days.map((day) => [day, 0]))
      entries.forEach((entry) => {
        const date = parseDate(entry.date ?? entry.startDate)
        if (!date) return
        const key = dayKey(date)
        if (map.has(key)) map.set(key, map.get(key) + entry.amountValue)
      })
      return map
    }
    const depositMap = bucket(deposits)
    const withdrawMap = bucket(withdrawals)
    return days.map((day) => ({
      date: day,
      deposits: depositMap.get(day) || 0,
      withdrawals: withdrawMap.get(day) || 0
    }))
  }, [deposits, withdrawals])

  const percentChange = useCallback((key) => {
    const recent = series.slice(7).reduce((sum, point) => sum + point[key], 0)
    const previous = series.slice(0, 7).reduce((sum, point) => sum + point[key], 0)
    if (previous === 0) return recent > 0 ? 100 : null
    return ((recent - previous) / previous) * 100
  }, [series])

  const query = searchTerm.trim().toLowerCase()

  const filteredUsers = useMemo(() => {
    if (!query) return users
    return users.filter((user) =>
      [fullName(user), user.email, user.username ?? user.userName]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query))
    )
  }, [users, query])

  const filterLedger = useCallback(
    (rows) => {
      if (!query) return rows
      return rows.filter((row) =>
        [row.userName, row.userEmail, row.plan, row.type, row.id]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query))
      )
    },
    [query]
  )

  /* ============================================================
     Auth actions
     ============================================================ */
  const handleLogin = async (event) => {
    event.preventDefault()
    if (authBusy) return
    setAuthBusy(true)
    try {
      const result = await api('/api/admin', { email: loginEmail, password: loginPassword })
      if (result.status === 200 || result.status === 'ok') {
        sessionStorage.setItem(SESSION_KEY, loginEmail)
        setAdminEmail(loginEmail)
        setAuthed(true)
        setLoginPassword('')
        notifySuccess('Welcome back')
      } else {
        notifyError(result.message || 'Invalid credentials')
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setAuthBusy(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
    setUsers([])
    setActiveView('overview')
    setSearchTerm('')
    setLoadingUsers(true)
  }

  /* ============================================================
     Modal plumbing — every opener seeds its own form state, so no
     value can leak from a previous operation into the next one.
     ============================================================ */
  const closeModal = () => {
    if (busy) return
    setModal(null)
    setAmountInput('')
    setPendingWithdrawal(null)
  }

  const openCredit = (user) => {
    setAmountInput('')
    setModal({ type: 'credit', user })
    setOpenRowMenu(null)
  }

  const openUpgrade = (user) => {
    setAmountInput('')
    setModal({ type: 'upgrade', user })
    setOpenRowMenu(null)
  }

  const openStats = (user) => {
    setStatsForm({
      totalprofit: user.totalprofit ?? '',
      refBonus: user.refBonus ?? '',
      totaldeposit: user.totaldeposit ?? '',
      totalwithdraw: user.totalwithdraw ?? ''
    })
    setModal({ type: 'stats', user })
    setOpenRowMenu(null)
  }

  const openDelete = (user) => {
    setModal({ type: 'delete', user })
    setOpenRowMenu(null)
  }

  const openCreate = () => {
    setCreateForm({ firstName: '', lastName: '', userName: '', email: '', password: '' })
    setModal({ type: 'create' })
  }

  const openApprove = async (user) => {
    setOpenRowMenu(null)
    setBusy(true)
    try {
      const info = await api('/api/getWithdrawInfo', { email: user.email })
      if (info?.amount === undefined || info?.amount === null) {
        notifyError(`${fullName(user)} has no withdrawal request pending.`)
        return
      }
      setPendingWithdrawal(toNumber(info.amount))
      setModal({ type: 'approve', user })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  /* ============================================================
     Mutations
     ============================================================ */
  const creditAmount = parseAmount(amountInput)
  const targetUser = modal?.user

  const submitCredit = async () => {
    if (busy) return
    const amount = parseAmount(amountInput)
    if (amount === null) {
      notifyError('Enter an amount greater than zero.')
      return
    }
    if (!targetUser?.email) {
      notifyError('No user selected.')
      return
    }
    setBusy(true)
    try {
      // Send a real Number: a string amount lets the backend concatenate
      // instead of add, which is what produced wrong balances.
      const result = await api('/api/fundwallet', { amount, email: targetUser.email })
      if (result.status !== 'ok') {
        throw new Error(result.error || result.message || 'The credit was rejected by the server.')
      }
      notifySuccess(`Credited ${money(amount)} to ${targetUser.email}`)
      setModal(null)
      setAmountInput('')

      if (result.upline) {
        await Promise.all([
          sendMail({ name: result.name, email: result.email, message: result.message, subject: result.subject }),
          sendMail({
            name: result.uplineName,
            email: result.uplineEmail,
            message: result.uplineMessage,
            subject: result.uplineSubject
          })
        ])
      } else {
        await sendMail({ name: result.name, email: result.email, message: result.message, subject: result.subject })
      }

      await fetchUsers({ silent: true })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitUpgrade = async () => {
    if (busy) return
    const amount = parseAmount(amountInput)
    if (amount === null) {
      notifyError('Enter an amount greater than zero.')
      return
    }
    setBusy(true)
    try {
      const result = await api('/api/upgradeUser', { amount, email: targetUser.email })
      if (result.status !== 'ok') {
        throw new Error(result.error || result.message || 'The upgrade was rejected by the server.')
      }
      notifySuccess(`Added ${money(amount)} profit to ${targetUser.email}`)
      setModal(null)
      setAmountInput('')
      await fetchUsers({ silent: true })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitStats = async () => {
    if (busy) return
    const numericOrUndefined = (value) => {
      if (value === '' || value === null || value === undefined) return undefined
      const parsed = Number(String(value).replace(/[$,\s]/g, ''))
      return Number.isFinite(parsed) ? parsed : undefined
    }
    const payload = {
      email: targetUser.email,
      totalprofit: numericOrUndefined(statsForm.totalprofit),
      refBonus: numericOrUndefined(statsForm.refBonus),
      totaldeposit: numericOrUndefined(statsForm.totaldeposit),
      totalwithdraw: numericOrUndefined(statsForm.totalwithdraw)
    }
    const hasChange = ['totalprofit', 'refBonus', 'totaldeposit', 'totalwithdraw'].some(
      (key) => payload[key] !== undefined
    )
    if (!hasChange) {
      notifyError('Enter at least one valid number.')
      return
    }
    setBusy(true)
    try {
      const result = await api('/api/admin/updateUserStats', payload)
      if (result.status !== 'ok') {
        throw new Error(result.message || 'Could not update statistics.')
      }
      notifySuccess(result.message || 'User statistics updated')
      setModal(null)
      await fetchUsers({ silent: true })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitDelete = async () => {
    if (busy) return
    setBusy(true)
    try {
      const result = await api('/api/deleteUser', { email: targetUser.email })
      const ok = result.status === 200 || result.status === 'ok' || result.status === '200'
      if (!ok) {
        throw new Error(result.message || result.error || 'Could not delete this user.')
      }
      notifySuccess(`${targetUser.email} has been deleted`)
      setModal(null)
      await fetchUsers({ silent: true })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitCreate = async (event) => {
    event.preventDefault()
    if (busy) return
    const { firstName, lastName, userName, email, password } = createForm
    if (!firstName.trim() || !lastName.trim() || !userName.trim() || !email.trim() || !password) {
      notifyError('All fields are required.')
      return
    }
    if (password.length < 6) {
      notifyError('Password must be at least 6 characters.')
      return
    }
    if (users.some((user) => String(user.email).toLowerCase() === email.trim().toLowerCase())) {
      notifyError('A user with that email already exists.')
      return
    }
    setBusy(true)
    try {
      const result = await api('/api/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        password,
        referralLink: ''
      })
      if (result.status === 'error') {
        throw new Error(result.message || 'Could not create this user.')
      }
      notifySuccess(`${email.trim().toLowerCase()} created`)
      setModal(null)
      await fetchUsers({ silent: true })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitApprove = async () => {
    if (busy) return
    setBusy(true)
    try {
      const amount = money(pendingWithdrawal)
      const sent = await sendMail({
        name: fullName(targetUser),
        email: targetUser.email,
        subject: 'Successful withdrawal',
        message: `Congratulations! Your withdrawal of ${amount} has been approved. Please confirm receipt by checking the balance of the wallet address you used to place the withdrawal.`
      })
      if (!sent) {
        throw new Error('The approval email could not be sent (the daily quota may be exhausted).')
      }
      notifySuccess(`Approval email sent to ${targetUser.email}`)
      setModal(null)
      setPendingWithdrawal(null)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const submitAdminSettings = async (event) => {
    event.preventDefault()
    if (updatingAdmin) return
    if (!adminNewEmail && !adminNewPassword) {
      notifyError('Enter a new email or a new password.')
      return
    }
    if (adminNewPassword && adminNewPassword.length < 6) {
      notifyError('Password must be at least 6 characters.')
      return
    }
    setUpdatingAdmin(true)
    try {
      const result = await api('/api/admin/update', {
        email: adminEmail,
        newEmail: adminNewEmail || undefined,
        newPassword: adminNewPassword || undefined
      })
      if (result.status !== 'ok') {
        throw new Error(result.message || 'Could not update your credentials.')
      }
      notifySuccess(result.message || 'Credentials updated')
      if (adminNewEmail) {
        setAdminEmail(adminNewEmail)
        sessionStorage.setItem(SESSION_KEY, adminNewEmail)
      }
      setAdminNewEmail('')
      setAdminNewPassword('')
    } catch (error) {
      notifyError(error.message)
    } finally {
      setUpdatingAdmin(false)
    }
  }

  /* ============================================================
     Column definitions
     ============================================================ */
  const ledgerColumns = (extra = []) => [
    {
      key: 'userName',
      label: 'User',
      render: (row) => (
        <div className="cell-user">
          <span className="avatar sm">{row.userInitials}</span>
          <span>
            <strong>{row.userName}</strong>
            <em>{row.userEmail}</em>
          </span>
        </div>
      ),
      csv: (row) => `${row.userName} <${row.userEmail}>`
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      sortValue: (row) => row.amountValue,
      render: (row) => <span className="amount">{money(row.amountValue)}</span>,
      csv: (row) => row.amountValue
    },
    ...extra,
    {
      key: 'date',
      label: 'Date',
      sortValue: (row) => row.dateValue,
      render: (row) => formatDate(row.date ?? row.startDate),
      csv: (row) => formatDate(row.date ?? row.startDate)
    }
  ]

  const depositColumns = ledgerColumns([
    {
      key: 'balance',
      label: 'Balance after',
      align: 'right',
      sortValue: (row) => toNumber(row.balance),
      render: (row) => money(row.balance),
      csv: (row) => toNumber(row.balance)
    }
  ])

  const withdrawalColumns = ledgerColumns([
    {
      key: 'balance',
      label: 'Balance after',
      align: 'right',
      sortValue: (row) => toNumber(row.balance),
      render: (row) => money(row.balance),
      csv: (row) => toNumber(row.balance)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: () => <span className="status-pill success">Approved</span>,
      csv: () => 'Approved'
    }
  ])

  const tradeColumns = ledgerColumns([
    { key: 'plan', label: 'Plan', render: (row) => <span className="status-pill neutral">{row.plan || '—'}</span> },
    {
      key: 'profit',
      label: 'Profit',
      align: 'right',
      sortValue: (row) => toNumber(row.profit),
      render: (row) => <span className="amount positive">{money(row.profit)}</span>,
      csv: (row) => toNumber(row.profit)
    }
  ])

  // Compact three-column variant used by the two overview panels.
  const recentColumns = [
    ledgerColumns()[0],
    ledgerColumns()[1],
    ledgerColumns()[ledgerColumns().length - 1]
  ]

  const userColumns = [
    {
      key: 'name',
      label: 'User',
      sortValue: (row) => fullName(row),
      render: (row) => (
        <div className="cell-user">
          <span className="avatar sm">{initials(row)}</span>
          <span>
            <strong>{fullName(row)}</strong>
            <em>@{row.username ?? row.userName ?? 'unknown'}</em>
          </span>
        </div>
      ),
      csv: (row) => fullName(row)
    },
    { key: 'email', label: 'Email', render: (row) => <span className="muted">{row.email}</span> },
    {
      key: 'funded',
      label: 'Balance',
      align: 'right',
      sortValue: (row) => toNumber(row.funded),
      render: (row) => <span className="amount">{money(row.funded)}</span>,
      csv: (row) => toNumber(row.funded)
    },
    {
      key: 'totalprofit',
      label: 'Profit',
      align: 'right',
      sortValue: (row) => toNumber(row.totalprofit),
      render: (row) => <span className="amount positive">{money(row.totalprofit)}</span>,
      csv: (row) => toNumber(row.totalprofit)
    },
    {
      key: 'totalwithdraw',
      label: 'Withdrawn',
      align: 'right',
      sortValue: (row) => toNumber(row.totalwithdraw),
      render: (row) => money(row.totalwithdraw),
      csv: (row) => toNumber(row.totalwithdraw)
    },
    {
      key: 'password',
      label: 'Password',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          className="password-cell"
          onClick={() => setRevealedPasswords((current) => ({ ...current, [row.email]: !current[row.email] }))}
        >
          <span>{revealedPasswords[row.email] ? row.password : '••••••••'}</span>
          {revealedPasswords[row.email] ? <BsEye /> : <BsEyeSlash />}
        </button>
      ),
      csv: (row) => row.password
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="row-menu" ref={openRowMenu === row.email ? menuRootRef : null}>
          <button
            type="button"
            className={`icon-button ${openRowMenu === row.email ? 'active' : ''}`}
            onClick={() => setOpenRowMenu(openRowMenu === row.email ? null : row.email)}
            aria-label={`Actions for ${row.email}`}
          >
            <MdMoreVert />
          </button>
          <AnimatePresence>
            {openRowMenu === row.email && (
              <motion.div
                className="row-menu-list"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                <button type="button" onClick={() => openCredit(row)}>
                  <MdAttachMoney className="i-success" /> Credit wallet
                </button>
                <button type="button" onClick={() => openUpgrade(row)}>
                  <MdUpgrade className="i-warning" /> Add profit
                </button>
                <button type="button" onClick={() => openStats(row)}>
                  <MdBarChart className="i-info" /> Edit statistics
                </button>
                <button type="button" onClick={() => openApprove(row)}>
                  <MdCheckCircle className="i-primary" /> Approve withdrawal
                </button>
                <span className="menu-divider" />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(row.email)
                    notifySuccess('Email copied')
                    setOpenRowMenu(null)
                  }}
                >
                  <MdContentCopy /> Copy email
                </button>
                <a href={`mailto:${row.email}`} onClick={() => setOpenRowMenu(null)}>
                  <MdEmail /> Send email
                </a>
                <span className="menu-divider" />
                <button type="button" className="danger" onClick={() => openDelete(row)}>
                  <MdDelete /> Delete user
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ),
      csv: () => ''
    }
  ]

  /* ============================================================
     Views
     ============================================================ */
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
    { id: 'users', label: 'Users', icon: <MdPeople />, count: users.length },
    { id: 'deposits', label: 'Deposits', icon: <MdAttachMoney />, count: deposits.length },
    { id: 'withdrawals', label: 'Withdrawals', icon: <MdSwapHoriz />, count: withdrawals.length },
    { id: 'trades', label: 'Investments', icon: <MdShowChart />, count: trades.length },
    { id: 'settings', label: 'Settings', icon: <MdSettings /> }
  ]

  const exportButton = (filename, columns, rows) => (
    <button type="button" className="ghost-button" onClick={() => downloadCsv(filename, columns, rows)} disabled={!rows.length}>
      <MdFileDownload /> Export CSV
    </button>
  )

  const renderOverview = () => (
    <>
      <div className="stat-grid">
        <StatCard
          icon={<MdPeople />}
          tone="primary"
          label="Registered users"
          value={loadingUsers ? '—' : users.length.toLocaleString()}
          caption={`${withdrawals.length + deposits.length} ledger entries`}
        />
        <StatCard
          icon={<MdAttachMoney />}
          tone="success"
          label="Wallet balances"
          value={money(totals.balance, 0)}
          caption={`${money(totals.deposited, 0)} deposited all-time`}
          delta={percentChange('deposits')}
          series={series.map((point) => point.deposits)}
        />
        <StatCard
          icon={<MdTrendingUp />}
          tone="info"
          label="Total profit paid"
          value={money(totals.profit, 0)}
          caption={`${money(totals.referral, 0)} in referral bonuses`}
        />
        <StatCard
          icon={<MdTrendingDown />}
          tone="warning"
          label="Total withdrawn"
          value={money(totals.withdrawn, 0)}
          caption={`${withdrawals.length} withdrawal requests`}
          delta={percentChange('withdrawals')}
          series={series.map((point) => point.withdrawals)}
        />
      </div>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Cash flow</h2>
            <p>Deposits against withdrawals over the last 14 days</p>
          </div>
          <div className="legend">
            <span className="legend-item"><i className="swatch deposits" /> Deposits</span>
            <span className="legend-item"><i className="swatch withdrawals" /> Withdrawals</span>
          </div>
        </header>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={series} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradDeposits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradWithdrawals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#7C8AA5', fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = parseDate(value)
                  return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : value
                }}
                minTickGap={18}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={64}
                tick={{ fill: '#7C8AA5', fontSize: 11 }}
                tickFormatter={(value) => (value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(148,163,184,0.3)' }} />
              <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#22C55E" strokeWidth={2} fill="url(#gradDeposits)" />
              <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#F59E0B" strokeWidth={2} fill="url(#gradWithdrawals)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="split-grid">
        <DataTable
          title="Recent deposits"
          subtitle="Latest five funding events"
          columns={recentColumns}
          rows={deposits.slice(0, 5)}
          loading={loadingUsers}
          emptyIcon={<MdInbox />}
          emptyTitle="No deposits yet"
          emptyText="Funding events will appear here as soon as users deposit."
        />
        <DataTable
          title="Recent withdrawals"
          subtitle="Latest five payout requests"
          columns={recentColumns}
          rows={withdrawals.slice(0, 5)}
          loading={loadingUsers}
          emptyIcon={<MdInbox />}
          emptyTitle="No withdrawals yet"
          emptyText="Payout requests will appear here once users withdraw."
        />
      </div>
    </>
  )

  const renderSettings = () => (
    <div className="settings-grid">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Administrator credentials</h2>
            <p>Change the email and password used to sign in to this console</p>
          </div>
        </header>
        <form className="panel-body form-stack" onSubmit={submitAdminSettings}>
          <div className="field">
            <label htmlFor="admin-current">Current email</label>
            <input id="admin-current" type="email" value={adminEmail} disabled />
          </div>
          <div className="field">
            <label htmlFor="admin-new-email">New email</label>
            <input
              id="admin-new-email"
              type="email"
              placeholder="Leave blank to keep the current email"
              value={adminNewEmail}
              onChange={(event) => setAdminNewEmail(event.target.value.trim().toLowerCase())}
            />
          </div>
          <div className="field">
            <label htmlFor="admin-new-password">New password</label>
            <input
              id="admin-new-password"
              type="password"
              placeholder="Leave blank to keep the current password"
              value={adminNewPassword}
              onChange={(event) => setAdminNewPassword(event.target.value)}
            />
            <small>Minimum 6 characters.</small>
          </div>
          <button type="submit" className="primary-button" disabled={updatingAdmin}>
            {updatingAdmin ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Platform summary</h2>
            <p>Aggregated figures across every account</p>
          </div>
        </header>
        <div className="panel-body summary-list">
          <div className="summary-row"><span>Registered users</span><strong>{users.length}</strong></div>
          <div className="summary-row"><span>Wallet balances</span><strong>{money(totals.balance)}</strong></div>
          <div className="summary-row"><span>Total deposited</span><strong>{money(totals.deposited)}</strong></div>
          <div className="summary-row"><span>Total withdrawn</span><strong>{money(totals.withdrawn)}</strong></div>
          <div className="summary-row"><span>Total profit paid</span><strong>{money(totals.profit)}</strong></div>
          <div className="summary-row"><span>Referral bonuses</span><strong>{money(totals.referral)}</strong></div>
        </div>
      </section>
    </div>
  )

  const viewMeta = {
    overview: { title: 'Overview', subtitle: 'Platform performance at a glance' },
    users: { title: 'Users', subtitle: 'Manage accounts, balances and statistics' },
    deposits: { title: 'Deposits', subtitle: 'Every funding event across the platform' },
    withdrawals: { title: 'Withdrawals', subtitle: 'Every payout request across the platform' },
    trades: { title: 'Investments', subtitle: 'Active and historical investment plans' },
    settings: { title: 'Settings', subtitle: 'Console configuration and totals' }
  }

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview()
      case 'users':
        return (
          <DataTable
            title="Accounts"
            subtitle={query ? `Filtered by “${searchTerm}”` : 'All registered accounts'}
            columns={userColumns}
            rows={filteredUsers}
            loading={loadingUsers}
            emptyIcon={<MdPeople />}
            emptyTitle={query ? 'No matching users' : 'No registered users yet'}
            emptyText={query ? 'Try a different name, username or email.' : 'New sign-ups will appear here automatically.'}
            emptyAction={
              !query && (
                <button type="button" className="primary-button" onClick={openCreate}>
                  <MdPersonAdd /> Add the first user
                </button>
              )
            }
            toolbar={exportButton('users.csv', userColumns.filter((column) => column.key !== 'actions'), filteredUsers)}
          />
        )
      case 'deposits': {
        const rows = filterLedger(deposits)
        return (
          <DataTable
            title="Deposits"
            subtitle="Sorted by most recent"
            columns={depositColumns}
            rows={rows}
            loading={loadingUsers}
            emptyIcon={<MdInbox />}
            emptyTitle="No deposits found"
            emptyText={query ? 'No deposit matches your search.' : 'Deposits will appear here as users fund their wallets.'}
            toolbar={exportButton('deposits.csv', depositColumns, rows)}
          />
        )
      }
      case 'withdrawals': {
        const rows = filterLedger(withdrawals)
        return (
          <DataTable
            title="Withdrawals"
            subtitle="Sorted by most recent"
            columns={withdrawalColumns}
            rows={rows}
            loading={loadingUsers}
            emptyIcon={<MdInbox />}
            emptyTitle="No withdrawals found"
            emptyText={query ? 'No withdrawal matches your search.' : 'Payout requests will appear here.'}
            toolbar={exportButton('withdrawals.csv', withdrawalColumns, rows)}
          />
        )
      }
      case 'trades': {
        const rows = filterLedger(trades)
        return (
          <DataTable
            title="Investments"
            subtitle="Every plan purchased by a user"
            columns={tradeColumns}
            rows={rows}
            loading={loadingUsers}
            emptyIcon={<MdShowChart />}
            emptyTitle="No investments found"
            emptyText={query ? 'No investment matches your search.' : 'Plans purchased by users will appear here.'}
            toolbar={exportButton('investments.csv', tradeColumns, rows)}
          />
        )
      }
      case 'settings':
        return renderSettings()
      default:
        return null
    }
  }

  /* ============================================================
     Login screen
     ============================================================ */
  if (!authed) {
    return (
      <main className="admin-auth">
        <div className="admin-auth-panel">
          <div className="admin-auth-brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <img src="/vaultexpertlogo.png" alt="VaultExpert" />
          </div>
          <h1>Admin console</h1>
          <p className="admin-auth-sub">Sign in to manage accounts, balances and payouts.</p>
          <form onSubmit={handleLogin} className="form-stack">
            <div className="field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="name@mail.com"
                required
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value.trim().toLowerCase())}
              />
            </div>
            <div className="field">
              <label htmlFor="admin-password">Password</label>
              <div className="field-with-affix">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="affix-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>
            <button type="submit" className="primary-button block" disabled={authBusy}>
              {authBusy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <button type="button" className="text-link" onClick={() => navigate('/')}>
            Return to website
          </button>
        </div>
      </main>
    )
  }

  /* ============================================================
     Dashboard
     ============================================================ */
  return (
    <div className={`admin-shell ${sidebarOpen ? 'is-open' : 'is-collapsed'}`}>
      {busy && <Loader />}

      <header className="topbar">
        <div className="topbar-left">
          <button type="button" className="icon-button" onClick={() => setSidebarOpen((current) => !current)} aria-label="Toggle navigation">
            <MdMenu />
          </button>
          <div className="topbar-brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <img src="/vaultexpertlogo.png" alt="VaultExpert" />
          </div>
        </div>

        <div className="topbar-right">
          <div className="search-field">
            <MdSearch />
            <input
              type="search"
              placeholder="Search users, emails, plans…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <button
            type="button"
            className={`icon-button ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchUsers({ silent: true })}
            aria-label="Refresh data"
            disabled={refreshing}
          >
            <MdRefresh />
          </button>
          <div className="topbar-profile">
            <span className="avatar">{(adminEmail || 'A').charAt(0).toUpperCase()}</span>
            <span className="topbar-profile-meta">
              <strong>Administrator</strong>
              <em>{adminEmail || 'signed in'}</em>
            </span>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <p className="sidebar-caption">Console</p>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveView(item.id)
                if (isMobile) setSidebarOpen(false)
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.count > 0 && <span className="sidebar-count">{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="sidebar-link danger" onClick={handleLogout}>
            <span className="sidebar-icon"><MdLogout /></span>
            <span className="sidebar-label">Sign out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && isMobile && <div className="scrim" onClick={() => setSidebarOpen(false)} />}

      <main className="content">
        <div className="page-head">
          <div>
            <h1>{viewMeta[activeView].title}</h1>
            <p>{viewMeta[activeView].subtitle}</p>
          </div>
          {activeView === 'users' && (
            <button type="button" className="primary-button" onClick={openCreate}>
              <MdPersonAdd /> Add user
            </button>
          )}
        </div>
        {renderView()}
      </main>

      {/* ================= Modals ================= */}
      <AnimatePresence>
        {modal?.type === 'credit' && (
          <Modal
            key={`credit-${targetUser?.email ?? 'none'}`}
            title="Credit wallet"
            description={`Add funds to ${targetUser?.email}`}
            onClose={closeModal}
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="button" className="primary-button" onClick={submitCredit} disabled={busy || creditAmount === null}>
                  {busy ? 'Processing…' : `Credit ${creditAmount !== null ? money(creditAmount) : ''}`.trim()}
                </button>
              </>
            }
          >
            <div className="field">
              <label htmlFor="credit-amount">Amount</label>
              <div className="money-input">
                <span className="prefix">$</span>
                <input
                  id="credit-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  autoFocus
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                />
                <span className="suffix">USD</span>
              </div>
              {amountInput !== '' && creditAmount === null && (
                <small className="error">Enter a positive amount.</small>
              )}
            </div>
            <div className="preview">
              <div><span>Current balance</span><strong>{money(targetUser?.funded)}</strong></div>
              <MdArrowUpward />
              <div><span>New balance</span><strong className="positive">{money(toNumber(targetUser?.funded) + (creditAmount ?? 0))}</strong></div>
            </div>
          </Modal>
        )}

        {modal?.type === 'upgrade' && (
          <Modal
            key={`upgrade-${targetUser?.email ?? 'none'}`}
            title="Add profit"
            description={`Credit trading profit to ${targetUser?.email}`}
            onClose={closeModal}
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="button" className="primary-button" onClick={submitUpgrade} disabled={busy || creditAmount === null}>
                  {busy ? 'Processing…' : 'Apply profit'}
                </button>
              </>
            }
          >
            <div className="field">
              <label htmlFor="upgrade-amount">Profit amount</label>
              <div className="money-input">
                <span className="prefix">$</span>
                <input
                  id="upgrade-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  autoFocus
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                />
                <span className="suffix">USD</span>
              </div>
            </div>
            <div className="preview">
              <div><span>Current profit</span><strong>{money(targetUser?.totalprofit)}</strong></div>
              <MdArrowUpward />
              <div><span>New profit</span><strong className="positive">{money(toNumber(targetUser?.totalprofit) + (creditAmount ?? 0))}</strong></div>
            </div>
          </Modal>
        )}

        {modal?.type === 'stats' && (
          <Modal
            key={`stats-${targetUser?.email ?? 'none'}`}
            title="Edit statistics"
            description={`Overwrite the displayed figures for ${targetUser?.email}`}
            onClose={closeModal}
            wide
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="button" className="primary-button" onClick={submitStats} disabled={busy}>
                  {busy ? 'Saving…' : 'Save changes'}
                </button>
              </>
            }
          >
            <div className="field-grid">
              {[
                { key: 'totalprofit', label: 'Total profit' },
                { key: 'refBonus', label: 'Referral bonus' },
                { key: 'totaldeposit', label: 'Total deposit' },
                { key: 'totalwithdraw', label: 'Total withdrawn' }
              ].map((item) => (
                <div className="field" key={item.key}>
                  <label htmlFor={`stat-${item.key}`}>{item.label}</label>
                  <div className="money-input">
                    <span className="prefix">$</span>
                    <input
                      id={`stat-${item.key}`}
                      type="number"
                      step="0.01"
                      value={statsForm[item.key]}
                      onChange={(event) => setStatsForm({ ...statsForm, [item.key]: event.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="hint">These values replace what the user sees on their dashboard. Leave a field blank to keep its current value.</p>
          </Modal>
        )}

        {modal?.type === 'create' && (
          <Modal
            key={`create-${targetUser?.email ?? 'none'}`}
            title="Add user"
            description="Create an account on behalf of a client"
            onClose={closeModal}
            wide
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="submit" form="create-user-form" className="primary-button" disabled={busy}>
                  {busy ? 'Creating…' : 'Create user'}
                </button>
              </>
            }
          >
            <form id="create-user-form" onSubmit={submitCreate}>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="new-firstname">First name</label>
                  <input id="new-firstname" value={createForm.firstName} onChange={(event) => setCreateForm({ ...createForm, firstName: event.target.value })} required />
                </div>
                <div className="field">
                  <label htmlFor="new-lastname">Last name</label>
                  <input id="new-lastname" value={createForm.lastName} onChange={(event) => setCreateForm({ ...createForm, lastName: event.target.value })} required />
                </div>
                <div className="field">
                  <label htmlFor="new-username">Username</label>
                  <input id="new-username" value={createForm.userName} onChange={(event) => setCreateForm({ ...createForm, userName: event.target.value })} required />
                </div>
                <div className="field">
                  <label htmlFor="new-email">Email</label>
                  <input id="new-email" type="email" value={createForm.email} onChange={(event) => setCreateForm({ ...createForm, email: event.target.value })} required />
                </div>
                <div className="field field-full">
                  <label htmlFor="new-password">Temporary password</label>
                  <input id="new-password" type="text" value={createForm.password} onChange={(event) => setCreateForm({ ...createForm, password: event.target.value })} required />
                  <small>At least 6 characters. Share it with the client so they can sign in and change it.</small>
                </div>
              </div>
            </form>
          </Modal>
        )}

        {modal?.type === 'approve' && (
          <Modal
            key={`approve-${targetUser?.email ?? 'none'}`}
            title="Approve withdrawal"
            onClose={closeModal}
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="button" className="primary-button" onClick={submitApprove} disabled={busy}>
                  {busy ? 'Sending…' : 'Send approval email'}
                </button>
              </>
            }
          >
            <div className="confirm-body">
              <p>
                This sends a withdrawal confirmation email to <strong>{targetUser?.email}</strong> for their pending request of{' '}
                <strong className="positive">{money(pendingWithdrawal)}</strong>.
              </p>
              <p className="hint">The email is sent immediately and cannot be recalled.</p>
            </div>
          </Modal>
        )}

        {modal?.type === 'delete' && (
          <Modal
            key={`delete-${targetUser?.email ?? 'none'}`}
            title="Delete account"
            onClose={closeModal}
            variant="danger"
            footer={
              <>
                <button type="button" className="ghost-button" onClick={closeModal} disabled={busy}>Cancel</button>
                <button type="button" className="danger-button" onClick={submitDelete} disabled={busy}>
                  {busy ? 'Deleting…' : 'Delete permanently'}
                </button>
              </>
            }
          >
            <div className="confirm-body">
              <div className="danger-icon"><MdWarningAmber /></div>
              <p>
                Permanently delete <strong>{targetUser?.email}</strong>? Their balance of{' '}
                <strong>{money(targetUser?.funded)}</strong> and full transaction history will be removed.
              </p>
              <p className="hint">This cannot be undone.</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admindashboard
