const API_URL = 'http://localhost:8000/prediction'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/${path}`, options)
  if (!response.ok) throw new Error('Prediction request failed')
  const result = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export function predictDisease(features) {
  return request('predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features),
  })
}

export function getPredictionMetrics() {
  return request('metrics')
}