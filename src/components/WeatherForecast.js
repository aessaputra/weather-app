import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import logo from '../assets/logo.png'

const WeatherForecast = () => {
  const [coordinates, setCoordinates] = useState('')
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')

  const fetchForecast = async () => {
    const apiKey = '35ykqvaGBxUIeKwvG2dF09L278z5Ji1j'
    const [latitude, longitude] = coordinates
      .split(',')
      .map((coord) => coord.trim())
    const url = `http://dataservice.accuweather.com/forecasts/v1/minute?q=${latitude},${longitude}&apikey=${apiKey}&language=id`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Gagal mengambil data')
      }
      const data = await response.json()
      setForecast(data)
      setError('')
    } catch (err) {
      setError(err.message)
      setForecast(null)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Cuaca MinuteCast
        </h1>
        <img src={logo} alt="Logo" className="mb-4 mx-auto w-1/2 h-auto" />
        <input
          type="text"
          placeholder="Masukkan Latitude, Longitude"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mb-4"
        />
        <button
          onClick={fetchForecast}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Dapatkan Ramalan
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-600 transition"
        >
          Logout
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {forecast && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ringkasan:</h2>
            <p>{forecast.Summary.Phrase}</p>
            <h3 className="mt-2 text-md font-semibold">Detail:</h3>
            {forecast.Summaries.map((summary, index) => (
              <p key={index}>
                {summary.MinuteText.replace(
                  '%MINUTE_VALUE',
                  summary.CountMinute,
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherForecast
