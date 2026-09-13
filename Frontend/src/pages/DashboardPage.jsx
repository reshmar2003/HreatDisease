import { useEffect, useState } from 'react'
import {
  Activity,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Users,
} from 'lucide-react'
import AnalysisCharts from '../components/AnalysisCharts.jsx'
import PatientRecordsPage from './PatientRecordsPage.jsx'
import { getChartData } from '../services/chartApi.js'
import { getPatientSummary } from '../services/patientApi.js'

const CARD_CONFIG = [
  {
    key: 'totalPatients',
    label: 'Total patients',
    description: 'Patients in the registry',
    icon: Users,
    className: 'card-teal',
  },
  {
    key: 'patientsWithoutHeartDisease',
    label: 'No heart disease',
    description: 'Patients with target 0',
    icon: Activity,
    className: 'card-blue',
  },
  {
    key: 'patientsWithHeartDisease',
    label: 'Heart disease',
    description: 'Patients with target 1',
    icon: HeartPulse,
    className: 'card-coral',
  },
]

function DashboardPage({ username, onSignOut }) {
  const [summary, setSummary] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState('dashboard')

  async function loadSummary() {
    setIsLoading(true)
    setError('')

    try {
      const [patientSummary, analysisData] = await Promise.all([getPatientSummary(), getChartData()])
      setSummary(patientSummary)
      setChartData(analysisData)
    } catch {
      setError('Unable to load patient statistics. Check that the API is running.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-mark"><HeartPulse size={22} strokeWidth={2.3} /></div>
          <div className="brand-name">Cardio<span>Sense</span></div>
        </div>

        <nav className="dashboard-nav" aria-label="Main menu">
          <p className="menu-label">Workspace</p>
          <button className={`menu-item ${activeView === 'dashboard' ? 'menu-item-active' : ''}`} type="button" onClick={() => setActiveView('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`menu-item ${activeView === 'records' ? 'menu-item-active' : ''}`} type="button" onClick={() => setActiveView('records')}>
            <ClipboardList size={18} /> Patient records
          </button>
        </nav>

        <button className="menu-item sign-out" type="button" onClick={onSignOut}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Heart Disease Prediction</p>
            <h1>Good to see you, {username}</h1>
            <p className="dashboard-subtitle">Monitor the patient registry at a glance.</p>
          </div>
          <button className="refresh-button" type="button" onClick={loadSummary} disabled={isLoading} title="Refresh statistics">
            <RefreshCw size={17} className={isLoading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </header>

        {activeView === 'records' ? <PatientRecordsPage /> : <>
          {error && <div className="dashboard-error" role="alert">{error}</div>}

        <section className="stats-grid" aria-label="Patient statistics">
          {CARD_CONFIG.map(({ key, label, description, icon: Icon, className }) => (
            <article className={`stat-card ${className}`} key={key}>
              <div className="stat-card-top">
                <div className="stat-icon"><Icon size={21} /></div>
                <span className="stat-kicker">Patient data</span>
              </div>
              <p className="stat-label">{label}</p>
              <strong className="stat-value">{isLoading ? '--' : (summary?.[key] ?? 0)}</strong>
              <p className="stat-description">{description}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-note">
          <div className="note-icon"><Activity size={20} /></div>
          <div>
            <h2>Clinical overview</h2>
            <p>Use these summary metrics as a starting point for patient-level prediction analysis.</p>
          </div>
        </section>

          <AnalysisCharts chartData={chartData} isLoading={isLoading} />
        </>}
      </main>
    </div>
  )
}

export default DashboardPage
