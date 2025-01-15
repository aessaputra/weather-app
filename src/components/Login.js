import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      console.log('User logged in:', data.user)
      navigate('/weather')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
