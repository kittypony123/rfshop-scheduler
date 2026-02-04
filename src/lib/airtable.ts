import { BASE_ID, DEFAULT_SELECT_OPTIONS } from './constants'
import type { AirtableRecord } from '../types/airtable'

/**
 * Airtable API client.
 *
 * Handles authentication, pagination, batch updates, and schema loading.
 * Ported from the original scheduler-app.html AirtableAPI class with
 * proper TypeScript types added.
 */
export class AirtableAPI {
  private token: string
  private baseUrl = 'https://api.airtable.com/v0'
  private selectOptions: Record<string, string[]> = {}
  private schemaLoaded = false

  constructor(token: string) {
    this.token = token
  }

  // ============ Core Request ============

  private async request<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMsg = response.statusText
      try {
        const errorJson = JSON.parse(errorText)
        errorMsg = errorJson.error?.message || errorMsg
      } catch {
        // Use statusText
      }
      throw new Error(`${response.status}: ${errorMsg}`)
    }

    return response.json() as Promise<T>
  }

  // ============ Connection & Schema ============

  /** Test connection by fetching 1 record */
  async testConnection(tableId: string): Promise<boolean> {
    const url = `${this.baseUrl}/${BASE_ID}/${tableId}?maxRecords=1`
    await this.request(url)
    return true
  }

  /** Load table schemas to discover select field options */
  async loadSchemas(): Promise<{ success: boolean; missingFields: string[]; schemaError?: string }> {
    try {
      const url = `${this.baseUrl}/meta/bases/${BASE_ID}/tables`
      const data = await this.request<{ tables: Array<{ id: string; fields: Array<{ name: string; type: string; options?: { choices?: Array<{ name: string }> } }> }> }>(url)

      for (const table of data.tables) {
        for (const field of table.fields) {
          if (field.type === 'singleSelect' && field.options?.choices) {
            this.selectOptions[field.name] = field.options.choices.map(c => c.name)
          }
        }
      }

      this.schemaLoaded = true
      return { success: true, missingFields: [] }
    } catch (err) {
      // Continue without schema — use defaults
      this.schemaLoaded = false
      return { success: true, missingFields: [], schemaError: (err as Error).message }
    }
  }

  /** Get select options for a field, falling back to defaults */
  getSelectOptions(fieldName: string): string[] {
    return this.selectOptions[fieldName] || DEFAULT_SELECT_OPTIONS[fieldName] || []
  }

  get isSchemaLoaded(): boolean {
    return this.schemaLoaded
  }

  // ============ CRUD Operations ============

  /** Fetch all records from a table with automatic pagination */
  async fetchAllRecords<T = Record<string, unknown>>(
    tableId: string,
    filterFormula?: string,
    fields?: string[]
  ): Promise<AirtableRecord<T>[]> {
    const records: AirtableRecord<T>[] = []
    let offset: string | undefined

    do {
      let url = `${this.baseUrl}/${BASE_ID}/${tableId}?pageSize=100`
      if (filterFormula) url += `&filterByFormula=${encodeURIComponent(filterFormula)}`
      if (fields && fields.length > 0) {
        for (const f of fields) {
          url += `&fields[]=${encodeURIComponent(f)}`
        }
      }
      if (offset) url += `&offset=${offset}`

      const data = await this.request<{ records: AirtableRecord<T>[]; offset?: string }>(url)
      records.push(...data.records)
      offset = data.offset
    } while (offset)

    return records
  }

  /** Update a single record */
  async updateRecord<T = Record<string, unknown>>(
    tableId: string,
    recordId: string,
    fields: Partial<T>
  ): Promise<AirtableRecord<T>> {
    const url = `${this.baseUrl}/${BASE_ID}/${tableId}/${recordId}`
    return this.request<AirtableRecord<T>>(url, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    })
  }

  /** Batch update records (max 10 per request, auto-batched with delay) */
  async updateRecordsBatch<T = Record<string, unknown>>(
    tableId: string,
    updates: Array<{ id: string; fields: Partial<T> }>
  ): Promise<AirtableRecord<T>[]> {
    const results: AirtableRecord<T>[] = []
    const BATCH_SIZE = 10
    const DELAY = 250

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE)
      const url = `${this.baseUrl}/${BASE_ID}/${tableId}`

      const result = await this.request<{ records: AirtableRecord<T>[] }>(url, {
        method: 'PATCH',
        body: JSON.stringify({ records: batch }),
      })
      results.push(...result.records)

      // Rate limit: wait between batches
      if (i + BATCH_SIZE < updates.length) {
        await new Promise(r => setTimeout(r, DELAY))
      }
    }

    return results
  }
}
