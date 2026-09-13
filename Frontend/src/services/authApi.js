import '../types/auth.js'

const API_URL = 'http://localhost:8000/login/login'

/**
 * @param {import('../types/auth.js').LoginRequest} credentials
 * @returns {Promise<import('../types/auth.js').BaseResponse>}
 */
export async function login(credentials) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error('Login request failed')
  }

  return response.json()
}
