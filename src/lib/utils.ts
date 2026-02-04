import { ORDER_SIZE_BUCKETS } from './constants'
import type { OrderSize } from '../types/airtable'

/** Format a date string as "04 Feb 2026" */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Format a number as GBP currency */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount == null) return '£0.00'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
}

/** Calculate days between two dates (positive = date2 is after date1) */
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

/** Days since a given date */
export function getAgeDays(dateStr: string | undefined | null): number {
  if (!dateStr) return 0
  return daysBetween(dateStr, new Date())
}

/** Add days to a date, return YYYY-MM-DD string */
export function addDays(date: string | Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/** Today as YYYY-MM-DD */
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

/** Calculate order size bucket from total quantity */
export function calculateOrderSize(totalQty: number | undefined | null): OrderSize {
  if (!totalQty || totalQty <= 0) return 'Micro (1-4)'
  for (const bucket of ORDER_SIZE_BUCKETS) {
    if (totalQty >= bucket.min && totalQty <= bucket.max) {
      return bucket.label as OrderSize
    }
  }
  return 'X Large (51+)'
}

/** Days until a target date. Negative = overdue */
export function daysUntil(dateStr: string | undefined | null): number | null {
  if (!dateStr) return null
  return daysBetween(today(), dateStr)
}

/** Classify urgency by days until target date */
export function getDateUrgency(dateStr: string | undefined | null): 'overdue' | 'this-week' | 'upcoming' | null {
  const days = daysUntil(dateStr)
  if (days === null) return null
  if (days < 0) return 'overdue'
  if (days <= 7) return 'this-week'
  return 'upcoming'
}
