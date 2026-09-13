import { useState } from 'react'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  const [user, setUser] = useState(null)

  if (user) {
    return <DashboardPage username={user} onSignOut={() => setUser(null)} />
  }

  return <LoginPage onLoginSuccess={setUser} />
}

export default App
