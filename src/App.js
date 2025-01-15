// src/App.js
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { supabase } from './utils/supabase'
import Login from './components/Login'
import WeatherForecast from './components/WeatherForecast'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null)
      },
    )

    // Tidak perlu unsubscribe, cukup hapus listener
    return () => {
      // Jika authListener adalah fungsi, panggil unsubscribe
      if (typeof authListener === 'function') {
        authListener()
      }
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/weather" /> : <Login />}
        />
        <Route
          path="/weather"
          element={user ? <WeatherForecast /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
