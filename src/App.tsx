import { useState, useEffect, useCallback } from 'react'
import { AirtableAPI } from './lib/airtable'
import { AppContext } from './lib/context'
import {
  QUOTES_TABLE_ID,
  BUILD_LINES_TABLE_ID,
  QUOTE_LINES_TABLE_ID,
  STORAGE_KEY_TOKEN,
} from './lib/constants'
import type { Quote, QuoteFields, BuildLine, BuildLineFields, QuoteLine, QuoteLineFields } from './types/airtable'
import { AuthScreen } from './components/AuthScreen'
import { Toast, type ToastItem } from './components/Toast'
import { OrdersDashboard } from './components/OrdersDashboard'
import { PartsStock } from './components/PartsStock'
import { BuildPlanner } from './components/BuildPlanner'

type View = 'orders' | 'parts' | 'planner'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(STORAGE_KEY_TOKEN))
  const [api, setApi] = useState<AirtableAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('orders')

  // Data state
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [buildLinesMap, setBuildLinesMap] = useState<Record<string, BuildLine[]>>({})
  const [quoteLinesMap, setQuoteLinesMap] = useState<Record<string, QuoteLine[]>>({})

  // Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  // Data loading
  const loadData = useCallback(async (apiInstance: AirtableAPI) => {
    setLoading(true)
    try {
      // Fetch all quotes (filter client-side for reliability)
      const quotesData = await apiInstance.fetchAllRecords<QuoteFields>(QUOTES_TABLE_ID)
      const quotesFields: Quote[] = quotesData
        .map(r => ({ id: r.id, ...r.fields }))
        .filter(q => ['ACCEPTED', 'SENT', 'DRAFT', 'INVOICED'].includes(q.Status))

      setQuotes(quotesFields)

      // Fetch build lines (Quote Parts Requirements)
      const buildData = await apiInstance.fetchAllRecords<BuildLineFields>(BUILD_LINES_TABLE_ID)
      const buildMap: Record<string, BuildLine[]> = {}
      for (const r of buildData) {
        const qn = r.fields.QuoteNumber
        if (!qn) continue
        if (!buildMap[qn]) buildMap[qn] = []
        buildMap[qn].push({ id: r.id, ...r.fields })
      }
      setBuildLinesMap(buildMap)

      // Fetch quote line items
      const quoteLinesData = await apiInstance.fetchAllRecords<QuoteLineFields>(QUOTE_LINES_TABLE_ID)
      const linesMap: Record<string, QuoteLine[]> = {}
      for (const r of quoteLinesData) {
        const qn = r.fields.QuoteNumber
        if (!qn) continue
        if (!linesMap[qn]) linesMap[qn] = []
        linesMap[qn].push({ id: r.id, ...r.fields })
      }
      setQuoteLinesMap(linesMap)

      addToast(`Loaded ${quotesFields.length} quotes`, 'success')
    } catch (err) {
      addToast(`Failed to load data: ${(err as Error).message}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  const refreshData = useCallback(async () => {
    if (api) await loadData(api)
  }, [api, loadData])

  // Auth flow
  const handleAuth = useCallback(async (newToken: string) => {
    setLoading(true)
    try {
      const apiInstance = new AirtableAPI(newToken)
      await apiInstance.testConnection(QUOTES_TABLE_ID)

      const schemaResult = await apiInstance.loadSchemas()
      if (schemaResult.schemaError) {
        addToast('Schema API unavailable — using defaults', 'warning')
      }

      setApi(apiInstance)
      setToken(newToken)
      await loadData(apiInstance)
    } catch (err) {
      addToast(`Connection failed: ${(err as Error).message}`, 'error')
      setToken(null)
      localStorage.removeItem(STORAGE_KEY_TOKEN)
    } finally {
      setLoading(false)
    }
  }, [addToast, loadData])

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    setToken(null)
    setApi(null)
    setQuotes([])
    setBuildLinesMap({})
    setQuoteLinesMap({})
  }, [])

  // Auto-connect on load if token exists
  useEffect(() => {
    if (token) {
      handleAuth(token)
    } else {
      setLoading(false)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show auth screen if not connected
  if (!token) {
    return <AuthScreen onAuth={handleAuth} />
  }

  // Show loading spinner on initial load
  if (loading && !api) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Connecting to Airtable...</p>
        </div>
      </div>
    )
  }

  if (!api) return null

  const navItems: { key: View; label: string }[] = [
    { key: 'orders', label: 'Orders' },
    { key: 'parts', label: 'Parts & Stock' },
    { key: 'planner', label: 'Build Planner' },
  ]

  return (
    <AppContext.Provider value={{ api, quotes, buildLinesMap, quoteLinesMap, addToast, refreshData, loading }}>
      <div className="h-screen flex flex-col bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold text-slate-800">RFShop Scheduler</h1>

            <nav className="flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    view === item.key
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Refresh data"
              title="Refresh data"
            >
              {loading ? (
                <span className="inline-block animate-spin">↻</span>
              ) : (
                '↻ Refresh'
              )}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {view === 'orders' && <OrdersDashboard />}
          {view === 'parts' && <PartsStock />}
          {view === 'planner' && <BuildPlanner />}
        </main>

        {/* Toasts */}
        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    </AppContext.Provider>
  )
}

export default App
