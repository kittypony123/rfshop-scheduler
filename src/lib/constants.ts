// ============ Airtable IDs ============

export const BASE_ID = 'app2rn4sxcLGg7JiS'
export const QUOTES_TABLE_ID = 'tbldUzgzZoKByIw6P'
export const BUILD_LINES_TABLE_ID = 'tblpHOLE5zHZR1Rul'
export const QUOTE_LINES_TABLE_ID = 'tbl3SQJ6AqAzXXk1L'

// ============ Order Size Buckets ============

export const ORDER_SIZE_BUCKETS = [
  { min: 1, max: 4, label: 'Micro (1-4)' },
  { min: 5, max: 10, label: 'Small (5-10)' },
  { min: 11, max: 20, label: 'Medium (11-20)' },
  { min: 21, max: 50, label: 'Large (21-50)' },
  { min: 51, max: Infinity, label: 'X Large (51+)' },
] as const

// ============ Default Select Options ============
// Used as fallback when Airtable schema API is unavailable

export const DEFAULT_SELECT_OPTIONS: Record<string, string[]> = {
  'Internal Job Type': ['Cable Assembly', 'Stock/Parts', 'Mixed', 'Unknown'],
  'Internal Status': ['Not scheduled', 'Scheduled', 'In Progress', 'Complete', 'Blocked'],
  'Urgency': ['Low', 'Medium', 'High', 'Critical'],
  'Complexity': ['Simple', 'Medium', 'Complex', 'Production'],
  'Order Size': ORDER_SIZE_BUCKETS.map(b => b.label),
  'Supplier Order Status': ['Not ordered', 'Ordered', 'Part received', 'Received'],
  'Line Build Status': ['Blocked', 'Ready', 'In Progress', 'Complete'],
  'Line Urgency': ['Low', 'Medium', 'High', 'Critical'],
  'Line Complexity': ['Simple', 'Medium', 'Complex', 'Production'],
}

// ============ App Defaults ============

export const DEFAULT_DAILY_CAPACITY = 15
export const STORAGE_KEY_TOKEN = 'rfshop_airtable_token'
export const STORAGE_KEY_CAPACITY = 'rfshop_daily_capacity'
