import { useState } from 'react'
import { AirtableAPI } from '../lib/airtable'
import { QUOTES_TABLE_ID, STORAGE_KEY_TOKEN } from '../lib/constants'

interface AuthScreenProps {
  onAuth: (token: string) => void
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY_TOKEN) || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const api = new AirtableAPI(token.trim())
      await api.testConnection(QUOTES_TABLE_ID)
      localStorage.setItem(STORAGE_KEY_TOKEN, token.trim())
      onAuth(token.trim())
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('401')) {
        setError('Invalid token. Check your Airtable Personal Access Token.')
      } else if (msg.includes('403')) {
        setError('Access denied. Ensure your token has access to the SALES base.')
      } else if (msg.includes('404')) {
        setError('Base not found. Check the Base ID configuration.')
      } else {
        setError(msg || 'Failed to connect. Check your token.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">RFShop Scheduler</h1>
          <p className="text-slate-500 mt-2">Connect your Airtable to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Airtable Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="pat..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-xs text-slate-400">
            Create a token at airtable.com/create/tokens with read/write access to the SALES base.
          </p>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  )
}
