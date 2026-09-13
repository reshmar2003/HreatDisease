import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'
import { getPatientList } from '../services/patientApi.js'

const PAGE_SIZE = 10

function PatientRecordsPage() {
  const [patients, setPatients] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setError('')

    getPatientList(page, PAGE_SIZE)
      .then((data) => {
        if (!isCurrent) return
        setPatients(data.patients ?? [])
        setTotal(data.total ?? 0)
      })
      .catch(() => {
        if (isCurrent) setError('Unable to load patient records. Check that the API is running.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => { isCurrent = false }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="records-section" aria-label="Patient records">
      <div className="section-heading records-heading">
        <div>
          <p className="eyebrow">Patient records</p>
          <h2>Registry patients</h2>
          <p className="dashboard-subtitle">{total} patients in the registry</p>
        </div>
        <div className="records-heading-icon"><ClipboardList size={22} /></div>
      </div>

      {error && <div className="dashboard-error" role="alert">{error}</div>}

      <div className="records-table-wrap">
        <table className="records-table">
          <thead>
            <tr><th>Patient name</th><th>Age</th><th>Sex</th><th>Target</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="4" className="records-message">Loading patient records...</td></tr>}
            {!isLoading && !patients.length && <tr><td colSpan="4" className="records-message">No patient records found.</td></tr>}
            {!isLoading && patients.map((patient, index) => (
              <tr key={`${patient.name}-${patient.age}-${index}`}>
                <td>{patient.name || 'Unnamed patient'}</td>
                <td>{patient.age}</td>
                <td>{patient.sex}</td>
                <td><span className={`target-badge target-${patient.target}`}>{patient.target === 1 ? 'Heart disease' : 'No heart disease'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="records-pagination">
        <span>Page {page} of {totalPages}</span>
        <div>
          <button type="button" className="page-button" onClick={() => setPage((current) => current - 1)} disabled={page === 1 || isLoading} title="Previous page">
            <ChevronLeft size={17} />
          </button>
          <button type="button" className="page-button" onClick={() => setPage((current) => current + 1)} disabled={page >= totalPages || isLoading} title="Next page">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PatientRecordsPage