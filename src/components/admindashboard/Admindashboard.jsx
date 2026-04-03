import React from 'react'
import './admindashboard.css'
import Swal from 'sweetalert2'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import { 
  MdClose, MdDashboard, MdPeople, MdAccountBalanceWallet, 
  MdSettings, MdLogout, MdMenu, MdNotifications, MdMoreVert, 
  MdAttachMoney, MdUpgrade, MdCheckCircle, MdBarChart, 
  MdEmail, MdDelete, MdTrendingUp, MdTrendingDown, 
  MdOutlineAttachMoney, MdSearch, MdSwapHoriz, MdShowChart
} from 'react-icons/md'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'   // npm install recharts

const Admindashboard = ({ route }) => {
  // SweetAlert toast
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  // ------------------- Existing state -------------------
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeletModal] = useState(false)
  const [activeEmail, setActiveEmail] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [users, setUsers] = useState([])
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userAmount, setUserAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('overview')   // changed from activeNav
  const [name, setName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditStatsModal, setShowEditStatsModal] = useState(false)
  const [editStatsData, setEditStatsData] = useState({
    totalprofit: '',
    refBonus: '',
    totaldeposit: '',
    totalwithdraw: ''
  })
  const [activeDropdown, setActiveDropdown] = useState(null)

  // ------------------- New state for Settings -------------------
  const [adminEmail, setAdminEmail] = useState('')
  const [adminNewEmail, setAdminNewEmail] = useState('')
  const [adminNewPassword, setAdminNewPassword] = useState('')
  const [updatingAdmin, setUpdatingAdmin] = useState(false)

  // ------------------- Existing functions (unchanged) -------------------
  const fetchUsers = async () => {
    const req = await fetch(`${route}/api/getUsers`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await req.json()
    setLoader(false)
    setUsers(res || [])
  }

  useEffect(() => {
    setLoader(true)
    fetchUsers()
  }, [])

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);   // collapsed on mobile
    } else {
      setSidebarOpen(true);    // expanded on desktop
    }
  };
  handleResize();              // run on mount
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const creditUser = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/fundwallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: userAmount, email: email })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: `Account credited with $${res.funded} USD` })
      const data = {
        service_id: 'service_zct33mb',
        template_id: 'template_qra6u7l',
        user_id: 'md-uhxzM-qX_OjH_m',
        template_params: {
          'name': `${res.name}`,
          'email': `${res.email}`,
          'message': `${res.message}`,
          'reply_to': `vaultexpertgroup@gmail.com`,
          'subject': `${res.subject}`
        }
      };
      if (res.upline === null) {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        const uplineData = {
          service_id: 'service_zct33mb',
          template_id: 'template_qra6u7l',
          user_id: 'md-uhxzM-qX_OjH_m',
          template_params: {
            'name': `${res.uplineName}`,
            'email': `${res.uplineEmail}`,
            'message': `${res.uplineMessage}`,
            'reply_to': `vaultexpertgroup@gmail.com`,
            'subject': `${res.uplineSubject}`
          }
        };
        await Promise.all([
          fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
          fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(uplineData) })
        ])
      }
      setEmail('')
      setUserAmount('')
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `sorry, something went wrong ${res.error} ` })
    }
  }

  const approveWithdraw = async () => {
    const userDetails = await fetch(`${route}/api/getWithdrawInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: activeEmail })
    })
    const awaitedData = await userDetails.json()
    if (awaitedData.amount !== undefined) {
      const data = {
        service_id: 'service_zct33mb',
        template_id: 'template_qra6u7l',
        user_id: 'md-uhxzM-qX_OjH_m',
        template_params: {
          'name': `${name}`,
          'email': `${activeEmail}`,
          'message': `Congratulations! your withdrawal $${awaitedData.amount} has been approved. confirm withdrawal of $${awaitedData.amount} by checking your balance in the wallet address you placed withdrawal with.`,
          'reply_to': `vaultexpertgroup@gmail.com`,
          'subject': `successful withdrawal`
        }
      };
      const req = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await req.json()
      if (res.status === 'OK') {
        Toast.fire({ icon: 'success', title: `approval email sent` })
      } else {
        Toast.fire({ icon: 'error', title: `email quota exceeded for the day` })
      }
    } else {
      Toast.fire({ icon: 'error', title: `user hasn't made any withdrawal yet` })
    }
  }

  const upgradeUser = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/upgradeUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: userAmount, email: activeEmail })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: `Account upgraded by $${res.funded} USD in profit` })
      setShowUpgradeModal(false)
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `something went wrong` })
    }
  }

  const deleteUser = async (email) => {
    const req = await fetch(`${route}/api/deleteUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const res = await req.json()
    if (res.status === 200) {
      setShowDeletModal(false)
      Toast.fire({ icon: 'success', title: `you have successfully deleted this user` })
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `something went wrong` })
    }
  }

  const updateUserStats = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/admin/updateUserStats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: activeEmail,
        totalprofit: editStatsData.totalprofit === '' ? undefined : Number(editStatsData.totalprofit),
        refBonus: editStatsData.refBonus === '' ? undefined : Number(editStatsData.refBonus),
        totaldeposit: editStatsData.totaldeposit === '' ? undefined : Number(editStatsData.totaldeposit),
        totalwithdraw: editStatsData.totalwithdraw === '' ? undefined : Number(editStatsData.totalwithdraw)
      })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: res.message || 'User stats updated successfully' })
      setShowEditStatsModal(false)
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: res.message || 'Something went wrong' })
    }
  }

  const openEditStatsModal = (user) => {
    setActiveEmail(user.email)
    setEditStatsData({
      totalprofit: user.totalprofit ?? '',
      refBonus: user.refBonus ?? '',
      totaldeposit: user.totaldeposit ?? '',
      totalwithdraw: user.totalwithdraw ?? ''
    })
    setShowEditStatsModal(true)
    setActiveDropdown(null)
  }

  const login = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 200) {
      setShowForm(false)
      setShowDashboard(true)
      // Also fetch admin email for settings panel (optional)
      setAdminEmail(email)
    } else {
      Toast.fire({ icon: 'error', title: 'Invalid credentials' })
    }
  }

  // ------------------- New: update admin credentials -------------------
  const updateAdminSettings = async () => {
    setUpdatingAdmin(true)
    const req = await fetch(`${route}/api/admin/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        newEmail: adminNewEmail || undefined,
        newPassword: adminNewPassword || undefined
      })
    })
    const res = await req.json()
    setUpdatingAdmin(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: res.message })
      setAdminNewEmail('')
      setAdminNewPassword('')
      if (adminNewEmail) setAdminEmail(adminNewEmail)
    } else {
      Toast.fire({ icon: 'error', title: res.message })
    }
  }

  // ------------------- Derived data for new views -------------------
  const allDeposits = users.flatMap(user => 
    (user.deposit || []).map(dep => ({
      ...dep,
      userName: `${user.firstname} ${user.lastname}`,
      userEmail: user.email,
    }))
  ).sort((a,b) => new Date(b.date) - new Date(a.date))

  const allWithdrawals = users.flatMap(user => 
    (user.withdraw || []).map(wd => ({
      ...wd,
      userName: `${user.firstname} ${user.lastname}`,
      userEmail: user.email,
    }))
  ).sort((a,b) => new Date(b.date) - new Date(a.date))

  const allTrades = users.flatMap(user => 
    (user.investment || []).map(inv => ({
      ...inv,
      userName: `${user.firstname} ${user.lastname}`,
      userEmail: user.email,
    }))
  ).sort((a,b) => new Date(b.startDate) - new Date(a.startDate))

  // Chart data (last 7 days)
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }
  const chartData = getLast7Days().map(day => {
    const depositsSum = allDeposits
      .filter(d => d.date?.startsWith(day))
      .reduce((sum, d) => sum + (d.amount || 0), 0)
    const withdrawalsSum = allWithdrawals
      .filter(w => w.date?.startsWith(day))
      .reduce((sum, w) => sum + (w.amount || 0), 0)
    return { date: day, deposits: depositsSum, withdrawals: withdrawalsSum }
  })

  const totalUsers = users.length
  const totalFunded = users.reduce((sum, user) => sum + (Number(user.funded) || 0), 0)
  const totalProfit = users.reduce((sum, user) => sum + (Number(user.totalprofit) || 0), 0)
  const totalWithdraw = users.reduce((sum, user) => sum + (Number(user.totalwithdraw) || 0), 0)

  // ------------------- Sidebar links -------------------
  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
    { id: 'users', label: 'Users', icon: <MdPeople /> },
    { id: 'deposits', label: 'Deposits', icon: <MdAttachMoney /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <MdSwapHoriz /> },
    { id: 'trades', label: 'Trades', icon: <MdShowChart /> },
    { id: 'settings', label: 'Settings', icon: <MdSettings /> },
  ]

  // Filter users for the Users table
  const filteredUsers = users.filter(user => 
    user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Helper to render generic tables for deposits/withdrawals/trades
  const renderDataTable = (title, data, columns) => (
    <div className="users-table-card glass-panel">
      <div className="table-header">
        <h2>{title}</h2>
        <span className="badge">{data.length} records</span>
      </div>
      <div className="table-responsive-wrapper">
        <table className="admin-table modern-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col.key}>{col.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ------------------- Render active view -------------------
  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            <div className="page-header">
              <div><h1>Overview</h1><p>Platform performance at a glance</p></div>
            </div>
            <div className="stats-grid">
              <div className="stat-card glass-panel">
                <div className="stat-icon-wrapper user-icon"><MdPeople /></div>
                <div className="stat-details"><h3>Total Users</h3><p className="stat-number">{totalUsers}</p></div>
              </div>
              <div className="stat-card glass-panel">
                <div className="stat-icon-wrapper money-icon"><MdOutlineAttachMoney /></div>
                <div className="stat-details"><h3>Total Funded</h3><p className="stat-number">${totalFunded.toLocaleString()}</p></div>
              </div>
              <div className="stat-card glass-panel">
                <div className="stat-icon-wrapper profit-icon"><MdTrendingUp /></div>
                <div className="stat-details"><h3>Total Profit</h3><p className="stat-number">${totalProfit.toLocaleString()}</p></div>
              </div>
              <div className="stat-card glass-panel">
                <div className="stat-icon-wrapper withdraw-icon"><MdTrendingDown /></div>
                <div className="stat-details"><h3>Total Withdrawn</h3><p className="stat-number">${totalWithdraw.toLocaleString()}</p></div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3>Daily Activity (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deposits" stroke="#4caf50" name="Deposits" />
                  <Line type="monotone" dataKey="withdrawals" stroke="#f44336" name="Withdrawals" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )

      case 'users':
        return (
          <>
            <div className="page-header">
              <div><h1>Users Management</h1><p>Monitor, manage, and scale your registered users</p></div>
              <div className="header-actions">
                <button className="primary-btn"><MdPeople /> Export Data</button>
              </div>
            </div>
            <div className="stats-grid">
              {/* same stats cards can be reused but already shown in overview; optional */}
            </div>
            {users.length > 0 ? (
              <div className="users-table-card glass-panel">
                <div className="table-header">
                  <h2>Active Users Database</h2>
                  <span className="badge">{filteredUsers.length} / {users.length} users</span>
                </div>
                <div className="table-responsive-wrapper">
                  <table className="admin-table modern-table">
                    <thead>
                      <tr>
                        <th>User</th><th>Email</th><th>Username</th><th>Deposit</th><th>Password</th><th className="actions-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.email}>
                          <td className="user-cell">
                            <div className="avatar-circle">{user.firstname?.charAt(0) || 'U'}</div>
                            <span className="user-fullname">{user.firstname} {user.lastname}</span>
                          </td>
                          <td className="email-cell">{user.email}</td>
                          <td className="username-cell">@{user.username}</td>
                          <td><span className="deposit-badge">${user.funded} USD</span></td>
                          <td className="password-cell"><span className="pwd-mask">{user.password}</span></td>
                          <td className="actions-cell">
                            <div className="dropdown-wrapper">
                              <button className={`kebab-btn ${activeDropdown === user.email ? 'active' : ''}`} 
                                      onClick={() => setActiveDropdown(activeDropdown === user.email ? null : user.email)}>
                                <MdMoreVert />
                              </button>
                              <AnimatePresence>
                                {activeDropdown === user.email && (
                                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                              animate={{ opacity: 1, y: 0, scale: 1 }}
                                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                              className="dropdown-menu modern-dropdown">
                                    <button onClick={() => { setShowModal(true); setEmail(user.email); setActiveDropdown(null); }}>
                                      <MdAttachMoney className="text-success" /> Credit User
                                    </button>
                                    <button onClick={() => { setShowUpgradeModal(true); setActiveEmail(user.email); setActiveDropdown(null); }}>
                                      <MdUpgrade className="text-warning" /> Upgrade Profit
                                    </button>
                                    <button onClick={() => { setActiveEmail(user.email); setName(user.firstname); approveWithdraw(); setActiveDropdown(null); }}>
                                      <MdCheckCircle className="text-primary" /> Approve WD
                                    </button>
                                    <button onClick={() => openEditStatsModal(user)}>
                                      <MdBarChart className="text-info" /> Edit Stats
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <a href={`mailto:${user.email}`} className="dropdown-item"><MdEmail /> Send Email</a>
                                    <button className="delete-item" onClick={() => { setShowDeletModal(true); setActiveEmail(user.email); setActiveDropdown(null); }}>
                                      <MdDelete /> Delete User
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-state glass-panel">
                <div className="empty-icon-circle"><MdPeople /></div>
                <h3>No registered users yet</h3>
                <p>When users sign up, they will appear in this database.</p>
              </div>
            )}
          </>
        )

      case 'deposits':
        return renderDataTable(
          'All Deposits',
          allDeposits,
          [
            { key: 'userName', label: 'User' },
            { key: 'userEmail', label: 'Email' },
            { key: 'amount', label: 'Amount ($)', render: row => `$${row.amount}` },
            { key: 'date', label: 'Date' },
            { key: 'balance', label: 'Balance After', render: row => `$${row.balance}` }
          ]
        )

      case 'withdrawals':
        return renderDataTable(
          'All Withdrawals',
          allWithdrawals,
          [
            { key: 'userName', label: 'User' },
            { key: 'userEmail', label: 'Email' },
            { key: 'amount', label: 'Amount ($)', render: row => `$${row.amount}` },
            { key: 'date', label: 'Date' },
            { key: 'balance', label: 'Balance After', render: row => `$${row.balance}` }
          ]
        )

      case 'trades':
        return renderDataTable(
          'All Trades / Investments',
          allTrades,
          [
            { key: 'userName', label: 'User' },
            { key: 'userEmail', label: 'Email' },
            { key: 'amount', label: 'Amount ($)', render: row => `$${row.amount}` },
            { key: 'plan', label: 'Plan' },
            { key: 'percent', label: 'ROI' },
            { key: 'profit', label: 'Profit ($)', render: row => `$${row.profit}` },
            { key: 'startDate', label: 'Start Date' }
          ]
        )

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Admin Settings</h2>
            <p>Update your login credentials</p>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Current Email</label>
              <input type="email" value={adminEmail} disabled style={{ background: '#f0f0f0' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>New Email (optional)</label>
              <input type="email" placeholder="Leave blank to keep current" value={adminNewEmail} onChange={(e) => setAdminNewEmail(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>New Password (optional)</label>
              <input type="password" placeholder="Leave blank to keep current" value={adminNewPassword} onChange={(e) => setAdminNewPassword(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={updateAdminSettings} disabled={updatingAdmin}>
              {updatingAdmin ? 'Updating...' : 'Update Credentials'}
            </button>
          </div>
        )

      default:
        return null
    }
  }

  // ------------------- Main JSX -------------------
  return (
    <main className='login-page admin-dash'>
      {loader && <Loader />}

      {/* Login Form */}
      {showForm && (
        <div className="login-wrapper">
          <form className="form_container" onSubmit={(e) => { e.preventDefault(); login(); }}>
            <div className="logo_container" onClick={() => navigate('/')}>
              <img src="/vaultexpertlogo.png" alt="" />
            </div>
            <div className="title_container">
              <p className="titles">welcome admin</p>
              <span className="subtitle">Welcome to vaultexpert, login and enjoy the best investment experience.</span>
            </div>
            <br />
            <div className="input_containers">
              <label className="input_labels" htmlFor="email_field">Email</label>
              <input onChange={(e) => setEmail(e.target.value.trim().toLowerCase())} required placeholder="name@mail.com" type="text" className="input_field" id="email_field" />
            </div>
            <div className="input_containers">
              <label className="input_labels" htmlFor="password_field">Password</label>
              <input type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value.trim())} placeholder="Password" required className="input_field" id="password_field" />
              <div className="eye-container" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </div>
            </div>
            <button type='submit'>login</button>
          </form>
        </div>
      )}

      {/* Dashboard */}
      {showDashboard && (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          {/* Top Navigation */}
          <nav className="admin-topnav">
            <div className="admin-topnav-left">
              <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MdMenu />
              </button>
              <div className="admin-topnav-brand" onClick={() => navigate('/')}>
                <img src="/vaultexpertlogo.png" alt="VaultExpert Logo" className="admin-nav-logo" />
              </div>
            </div>
            <div className="admin-topnav-right">
              <div className="search-bar">
                <MdSearch className="search-icon" />
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="admin-nav-badge">
                <MdNotifications />
                {users.length > 0 && <span className="notif-dot">{users.length}</span>}
              </div>
              <div className="admin-nav-profile">
                <div className="admin-nav-avatar">A</div>
                <div className="admin-info">
                  <span className="admin-nav-role">Administrator</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Sidebar */}
          <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
            <div className="admin-sidebar-header">
              {sidebarOpen ? <span>Overview</span> : <MdDashboard />}
            </div>
            <ul className="admin-sidebar-nav">
              {sidebarLinks.map(link => (
                <li key={link.id} className={`admin-sidebar-item ${activeView === link.id ? 'active' : ''}`} onClick={() => setActiveView(link.id)}>
                  <span className="sidebar-item-icon">{link.icon}</span>
                  {sidebarOpen && <span className="sidebar-item-label">{link.label}</span>}
                </li>
              ))}
            </ul>
            <div className="admin-sidebar-footer">
              <div className="admin-sidebar-item sidebar-logout" onClick={() => { setShowForm(true); setShowDashboard(false); }}>
                <span className="sidebar-item-icon"><MdLogout /></span>
                {sidebarOpen && <span className="sidebar-item-label">Logout</span>}
              </div>
            </div>
          </aside>

          {sidebarOpen && window.innerWidth < 768 && (
            <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main Content */}
          <main className="admin-main-content">
            <div className="dashboard-container">
              {renderActiveView()}
            </div>
          </main>
        </div>
      )}

      {/* MODALS (unchanged) */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="modern-modal glass-panel">
              <div className="modal-header"><h2>Credit Account</h2><button className="icon-btn" onClick={() => setShowModal(false)}><MdClose /></button></div>
              <div className="modal-body"><p className="modal-desc">Enter the amount to credit to <strong>{email}</strong></p>
              <div className="input-group"><span className="input-prefix">$</span><input type="number" placeholder="0.00" onChange={(e) => setUserAmount(e.target.value)} /><span className="input-suffix">USD</span></div></div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn-primary" onClick={creditUser}>Process Credit</button></div>
            </motion.div>
          </motion.div>
        )}

        {showUpgradeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="modern-modal glass-panel">
              <div className="modal-header"><h2>Upgrade Profit</h2><button className="icon-btn" onClick={() => setShowUpgradeModal(false)}><MdClose /></button></div>
              <div className="modal-body"><p className="modal-desc">Add profit manually for <strong>{activeEmail}</strong></p>
              <div className="input-group"><span className="input-prefix">$</span><input type="number" placeholder="0.00" onChange={(e) => setUserAmount(e.target.value)} /><span className="input-suffix">USD</span></div></div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowUpgradeModal(false)}>Cancel</button><button className="btn-primary" onClick={upgradeUser}>Apply Upgrade</button></div>
            </motion.div>
          </motion.div>
        )}

        {showEditStatsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="modern-modal glass-panel edit-stats-modal">
              <div className="modal-header"><h2>Edit User Statistics</h2><button className="icon-btn" onClick={() => setShowEditStatsModal(false)}><MdClose /></button></div>
              <div className="modal-body">
                <div className="stats-grid-form">
                  <div className="form-group"><label>Total Profit</label><div className="input-group"><span className="input-prefix">$</span><input type="number" value={editStatsData.totalprofit} onChange={(e) => setEditStatsData({ ...editStatsData, totalprofit: e.target.value })} /></div></div>
                  <div className="form-group"><label>Referral Bonus</label><div className="input-group"><span className="input-prefix">$</span><input type="number" value={editStatsData.refBonus} onChange={(e) => setEditStatsData({ ...editStatsData, refBonus: e.target.value })} /></div></div>
                  <div className="form-group"><label>Total Deposit</label><div className="input-group"><span className="input-prefix">$</span><input type="number" value={editStatsData.totaldeposit} onChange={(e) => setEditStatsData({ ...editStatsData, totaldeposit: e.target.value })} /></div></div>
                  <div className="form-group"><label>Total Withdraw</label><div className="input-group"><span className="input-prefix">$</span><input type="number" value={editStatsData.totalwithdraw} onChange={(e) => setEditStatsData({ ...editStatsData, totalwithdraw: e.target.value })} /></div></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowEditStatsModal(false)}>Cancel</button><button className="btn-primary" onClick={updateUserStats}>Save Changes</button></div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modern-modal danger-modal glass-panel">
              <div className="danger-icon-large"><MdDelete /></div>
              <div className="modal-body text-center"><h2>Delete Account?</h2><p>Are you sure you want to permanently delete <strong>{activeEmail}</strong>? This action cannot be undone.</p></div>
              <div className="modal-footer split-footer"><button className="btn-secondary w-100" onClick={() => setShowDeletModal(false)}>Cancel</button><button className="btn-danger w-100" onClick={() => deleteUser(activeEmail)}>Yes, Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Admindashboard