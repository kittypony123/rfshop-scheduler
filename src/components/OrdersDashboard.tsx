import { useContext } from 'react'
import { AppContext } from '../lib/context'

/** Orders Dashboard — Phase 2 will flesh this out fully */
export function OrdersDashboard() {
  const ctx = useContext(AppContext)
  if (!ctx) return null

  const activeQuotes = ctx.quotes.filter(q =>
    q.Status === 'ACCEPTED' || q.Status === 'SENT'
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white">
        <h2 className="text-lg font-semibold text-slate-800">Orders</h2>
        <p className="text-sm text-slate-500 mt-1">
          {activeQuotes.length} active order{activeQuotes.length !== 1 ? 's' : ''} (ACCEPTED + SENT)
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeQuotes.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            No active orders found.
          </div>
        ) : (
          <div className="space-y-2">
            {activeQuotes.map(q => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-slate-700">
                      {q.QuoteNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      q.Status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {q.Status}
                    </span>
                    {q.Urgency && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        q.Urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                        q.Urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                        q.Urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {q.Urgency}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {q.Total != null ? `£${q.Total.toFixed(2)}` : ''}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {q.ContactName}
                  {q['Target Build Date'] && (
                    <span className="ml-3 text-slate-400">
                      Target: {q['Target Build Date']}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
