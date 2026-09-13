import { useEffect, useState } from 'react'
import { BrainCircuit, LoaderCircle, Sparkles } from 'lucide-react'
import { getPredictionMetrics, predictDisease } from '../services/predictionApi.js'

const FIELDS = [
  ['age', 'Age', 'number', 'e.g. 55'],
  ['sex', 'Sex', 'select', [['0', 'Female'], ['1', 'Male']]],
  ['cp', 'Chest pain type', 'select', [['0', 'Typical angina'], ['1', 'Atypical angina'], ['2', 'Non-anginal pain'], ['3', 'Asymptomatic']]],
  ['trestbps', 'Resting blood pressure', 'number', 'e.g. 130'],
  ['chol', 'Cholesterol', 'number', 'e.g. 240'],
  ['fbs', 'Fasting blood sugar', 'select', [['0', 'Below 120 mg/dl'], ['1', 'Above 120 mg/dl']]],
  ['restecg', 'Resting ECG', 'select', [['0', 'Normal'], ['1', 'ST-T wave abnormality'], ['2', 'Left ventricular hypertrophy']]],
  ['thalachh', 'Maximum heart rate', 'number', 'e.g. 150'],
  ['exang', 'Exercise angina', 'select', [['0', 'No'], ['1', 'Yes']]],
  ['oldpeak', 'Oldpeak', 'number', 'e.g. 1.0'],
  ['slope', 'ST slope', 'select', [['0', 'Upsloping'], ['1', 'Flat'], ['2', 'Downsloping']]],
  ['ca', 'Major vessels', 'select', [['0', '0 vessels'], ['1', '1 vessel'], ['2', '2 vessels'], ['3', '3 vessels'], ['4', '4 vessels']]],
  ['thal', 'Thalassemia', 'select', [['0', 'Normal'], ['1', 'Fixed defect'], ['2', 'Reversible defect'], ['3', 'Other']]],
]

const EMPTY_VALUES = Object.fromEntries(FIELDS.map(([field]) => [field, '']))

function PredictionPanel() {
  const [name, setName] = useState('')
  const [values, setValues] = useState(EMPTY_VALUES)
  const [result, setResult] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getPredictionMetrics().then(setMetrics).catch(() => setError('Model metrics are unavailable. Start the backend API.'))
  }, [])

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: field === 'oldpeak' ? Number(value) : Number.parseInt(value, 10) }))
  }

  async function submit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      setResult(await predictDisease({ name, ...values }))
    } catch {
      setError('Unable to predict disease. Check that the backend API is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="prediction-section" aria-label="Random Forest disease prediction">
      <div className="section-heading prediction-heading">
        <div><p className="eyebrow">Random Forest analysis</p><h2>Predict heart disease risk</h2><p className="dashboard-subtitle">Enter clinical values to run the trained model.</p></div>
        <div className="records-heading-icon"><BrainCircuit size={22} /></div>
      </div>
      <form className="prediction-form" onSubmit={submit}>
        <label className="prediction-field prediction-name-field">Patient name
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Priya Sharma" maxLength="250" required />
        </label>
        <div className="prediction-fields">
          {FIELDS.map(([field, label, type, hint]) => (
            <label key={field} className="prediction-field">{label}
              {type === 'select' ? (
                <select value={values[field]} onChange={(event) => updateValue(field, event.target.value)} required>
                  <option value="">Select {label.toLowerCase()}</option>
                  {hint.map(([value, optionLabel]) => <option value={value} key={value}>{optionLabel}</option>)}
                </select>
              ) : (
                <input type="number" step={field === 'oldpeak' ? '0.1' : '1'} value={values[field]} onChange={(event) => updateValue(field, event.target.value)} placeholder={hint} required />
              )}
            </label>
          ))}
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />} {isLoading ? 'Analyzing...' : 'Run prediction'}</button>
      </form>
      {error && <div className="dashboard-error" role="alert">{error}</div>}
      {result && <div className={`prediction-result prediction-${result.prediction}`}><strong>{result.label}</strong><span>Confidence: {Math.round(result.confidence * 100)}%</span><small>Random Forest accuracy: {Math.round(result.accuracy * 100)}%</small></div>}
      {metrics && <p className="model-note">Model trained on {metrics.training_rows} records with {metrics.folds}-fold validation. Accuracy range: {Math.round(metrics.accuracy_min * 100)}-{Math.round(metrics.accuracy_max * 100)}%.</p>}
    </section>
  )
}

export default PredictionPanel