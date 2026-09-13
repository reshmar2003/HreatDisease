import { useEffect, useState } from 'react'
import { ArrowLeft, ClipboardList, LoaderCircle } from 'lucide-react'
import { getPatientView } from '../services/patientApi.js'

const DETAIL_FIELDS = [
  ['id', 'ID'], ['name', 'Name'], ['age', 'Age'], ['sex', 'Sex'], ['cp', 'Chest pain type'],
  ['trestbps', 'Resting blood pressure'], ['chol', 'Cholesterol'], ['fbs', 'Fasting blood sugar'],
  ['restecg', 'Resting ECG'], ['thalachh', 'Maximum heart rate'], ['exang', 'Exercise angina'],
  ['oldpeak', 'Oldpeak'], ['slope', 'ST slope'], ['ca', 'Major vessels'], ['thal', 'Thalassemia'],
  ['target', 'Target'],
]

function displayValue(field, value) {
  if (field === 'sex') return value === 1 ? 'Male' : 'Female'
  if (field === 'target') return value === 1 ? 'Heart disease' : 'No heart disease'
  return value
}

function PatientViewPage({ patientId, onBack }) {
  const [patient, setPatient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setError('')

    getPatientView(patientId)
      .then((data) => { if (isCurrent) setPatient(data) })
      .catch(() => { if (isCurrent) setError('Unable to load patient details. Check that the API is running.') })
      .finally(() => { if (isCurrent) setIsLoading(false) })

    return () => { isCurrent = false }
  }, [patientId])

  return (
    <section className="patient-view-section" aria-label="Patient details">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to patient records</button>
      <div className="patient-view-heading">
        <div><p className="eyebrow">Patient details</p><h2>{patient?.name || `Patient ${patientId}`}</h2><p className="dashboard-subtitle">Complete PatientInfo record</p></div>
        <div className="records-heading-icon"><ClipboardList size={22} /></div>
      </div>

      {isLoading && <div className="records-message patient-view-message"><LoaderCircle className="spin" size={20} /> Loading patient details...</div>}
      {error && <div className="dashboard-error" role="alert">{error}</div>}
      {patient && <div className="patient-detail-panel patient-view-panel"><div className="patient-detail-grid">{DETAIL_FIELDS.map(([field, label]) => <div key={field}><span>{label}</span><strong>{displayValue(field, patient[field])}</strong></div>)}</div></div>}
    </section>
  )
}

export default PatientViewPage