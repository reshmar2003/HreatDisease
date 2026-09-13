import PredictionPanel from '../components/PredictionPanel.jsx'

function HeartDiseaseAnalysisPage() {
  return (
    <section className="analysis-page" aria-label="Heart disease analysis">
      <div className="section-heading analysis-page-heading">
        <p className="eyebrow">Heart disease analysis</p>
        <h2>Random Forest prediction</h2>
        <p className="dashboard-subtitle">Use patient clinical values to estimate heart disease risk.</p>
      </div>
      <PredictionPanel />
    </section>
  )
}

export default HeartDiseaseAnalysisPage