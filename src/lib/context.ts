import { createContext } from 'react'
import type { AirtableAPI } from './airtable'
import type { Quote, BuildLine, QuoteLine } from '../types/airtable'

export interface AppContextValue {
  api: AirtableAPI
  quotes: Quote[]
  buildLinesMap: Record<string, BuildLine[]>
  quoteLinesMap: Record<string, QuoteLine[]>
  addToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  refreshData: () => Promise<void>
  loading: boolean
}

export const AppContext = createContext<AppContextValue | null>(null)
