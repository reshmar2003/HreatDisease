const API_URL = 'http://localhost:8000/card'

async function getCount(path) {
  const response = await fetch(`${API_URL}/${path}`)
  if (!response.ok) {
    throw new Error('Patient summary request failed')
  }

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data.count
}

export function getPatientSummary() {
  return Promise.all([
    getCount('totalPatient'),
    getCount('NoHeartDieases'),
    getCount('HeartDieases'),
  ]).then(([totalPatients, patientsWithoutHeartDisease, patientsWithHeartDisease]) => ({
    totalPatients,
    patientsWithoutHeartDisease,
    patientsWithHeartDisease,
  }))
}

export async function getPatientList(pageno, pagecount) {
  const response = await fetch(`${API_URL}/patientList`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageno, pagecount }),
  })

  if (!response.ok) {
    throw new Error('Patient list request failed')
  }

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}
