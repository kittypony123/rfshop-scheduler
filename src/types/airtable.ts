// ============ Airtable Record Types ============

/** Raw Airtable record wrapper */
export interface AirtableRecord<T = Record<string, unknown>> {
  id: string
  fields: T
  createdTime?: string
}

/** Quoted table fields (from Xero + scheduling fields) */
export interface QuoteFields {
  QuoteNumber: string
  QuoteID?: string
  Reference?: string
  Status: QuoteStatus
  QuoteDate?: string
  ExpiryDate?: string
  ContactName?: string
  ContactEmail?: string
  ContactFirstName?: string
  ContactLastName?: string
  ContactAccountNumber?: string
  Currency?: string
  SubTotal?: number
  TotalTax?: number
  Total?: number
  TotalDiscount?: number
  Title?: string
  Summary?: string
  Terms?: string
  LineItemsCount?: number
  LineItemsSummary?: string
  // Scheduling fields
  'Internal Job Type'?: JobType
  'Internal Status'?: InternalStatus
  Urgency?: Urgency
  Complexity?: Complexity
  'Order Size'?: OrderSize
  'Target Build Date'?: string
  'Expected Delivery Date'?: string
  'Completion Date'?: string
  'Scheduling Notes'?: string
  'Supplier / PO Reference'?: string
  'Last Reviewed'?: string
  'Supplier Order Status'?: SupplierOrderStatus
  // Batch order fields (new for v2)
  'Is Batch Order'?: boolean
  'Batch Frequency'?: string
  'Total Batches'?: number
  'Batches Completed'?: number
  'Estimated Lead Time'?: string
}

/** Quote with Airtable record ID merged in */
export interface Quote extends QuoteFields {
  id: string
}

/** Quote Parts Requirements table fields */
export interface BuildLineFields {
  QuoteNumber: string
  QuoteStatus?: string
  CustomerName?: string
  AssemblySKU?: string
  AssemblyDescription?: string
  AssemblyQty?: number
  Connector1Code?: string
  Connector1SKU?: string
  Connector1Qty?: number
  Connector2Code?: string
  Connector2SKU?: string
  Connector2Qty?: number
  CableCode?: string
  CableLengthMM?: number
  TotalCableLengthM?: number
  WorkStatus?: WorkStatus
  Quote?: string[]
  // Scheduling fields
  'Line Target Build Date'?: string
  'Line Build Status'?: LineBuildStatus
  'Line Urgency'?: Urgency
  'Line Complexity'?: Complexity
  'Line Scheduling Notes'?: string
  // Stock check-off fields (new for v2)
  'Connector1 In Stock'?: boolean
  'Connector2 In Stock'?: boolean
  'Cable In Stock'?: boolean
  'Parts Verified Date'?: string
  'Parts Verified By'?: string
}

/** Build line with Airtable record ID merged in */
export interface BuildLine extends BuildLineFields {
  id: string
}

/** Quotes Line Items table fields */
export interface QuoteLineFields {
  QuoteNumber?: string
  Description?: string
  ItemCode?: string
  Quantity?: number
  UnitAmount?: number
  LineAmount?: number
  DiscountAmount?: number
  DiscountRate?: number
  TaxAmount?: number
  TaxType?: string
  Quote?: string[]
}

/** Quote line item with Airtable record ID merged in */
export interface QuoteLine extends QuoteLineFields {
  id: string
}

// ============ Enum Types ============

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'INVOICED' | 'DECLINED' | 'DELETED'

export type JobType = 'Cable Assembly' | 'Stock/Parts' | 'Mixed' | 'Unknown'

export type InternalStatus = 'Not scheduled' | 'Scheduled' | 'In Progress' | 'Complete' | 'Blocked'

export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical'

export type Complexity = 'Simple' | 'Medium' | 'Complex' | 'Production'

export type OrderSize = 'Micro (1-4)' | 'Small (5-10)' | 'Medium (11-20)' | 'Large (21-50)' | 'X Large (51+)'

export type SupplierOrderStatus = 'Not ordered' | 'Ordered' | 'Part received' | 'Received'

export type WorkStatus = 'To Do' | 'In Progress' | 'Complete'

export type LineBuildStatus = 'Blocked' | 'Ready' | 'In Progress' | 'Complete'
