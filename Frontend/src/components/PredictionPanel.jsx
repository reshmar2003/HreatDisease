import { useEffect, useState } from 'react'
import { BrainCircuit, LoaderCircle, Sparkles } from 'lucide-react'
import { getPredictionMetrics, predictDisease } from '../services/predictionApi.js'

const DEFAULT_VALUES = {
  age: 55, sex: 1, cp: 1, trestbps: 130, chol: 240, fbs: 0, restecg: 0,
  thalachh: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2,
}

const FIELDS = [
  ['age', 'Age'], ['sex', 'Sex (0 female, 1 male)'], ['cp', 'Chest pain type'],
  ['trestbps', 'Resting blood pressure'], ['chol', 'Cholesterol'], ['fbs', 'Fasting blood sugar'],
  ['restecg', 'Resting ECG'], ['thalachh', 'Maximum heart rate'], ['exang', 'Exercise angina'],
  ['oldpeak', 'Oldpeak'], ['slope', 'ST slope'], ['ca', 'Major vessels'], ['thal', 'Thalassemia'],
]

function PredictionPanel() {
  const [values, setValues] = useState(DEFAULT_VALUES)
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
      setResult(await predictDisease(values))
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
        <div className="prediction-fields">
          {FIELDS.map(([field, label]) => (
            <label key={field} className="prediction-field">{label}
              <input type="number" step={field === 'oldpeak' ? '0.1' : '1'} value={values[field]} onChange={(event) => updateValue(field, event.target.value)} required />
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