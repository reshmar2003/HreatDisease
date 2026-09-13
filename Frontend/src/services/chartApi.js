const API_URL = 'http://localhost:8000/chart'

async function getChart(path) {
  const response = await fetch(`${API_URL}/${path}`)
  if (!response.ok) {
    throw new Error('Chart request failed')
  }

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}

export function getChartData() {
  return Promise.all([
    getChart('HeartDiease'),
    getChart('AgeDistribution'),
    getChart('cholesterolAnalysis'),
    getChart('BloodPressureAnalysis'),
    getChart('MaximumHeartRateAnalysis'),
    getChart('chestPainType'),
  ]).then(([heartDisease, ageDistribution, cholesterol, bloodPressure, maximumHeartRate, chestPainType]) => ({
    heartDisease,
    ageDistribution,
    cholesterol,
    bloodPressure,
    maximumHeartRate,
    chestPainType,
  }))
}
