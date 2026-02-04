# Data Schema

## Airtable Base

- **Name:** SALES
- **ID:** `app2rn4sxcLGg7JiS`

This app reads from 3 tables and writes scheduling/status fields back to 2 of them.

## Tables Overview

| Table | ID | Records From | This App |
|-------|----|-------------|----------|
| Quoted | `tbldUzgzZoKByIw6P` | `sync_xero_quotes.py` | Reads + writes scheduling fields |
| Quote Parts Requirements | `tblpHOLE5zHZR1Rul` | `parse_quote_parts.py` | Reads + writes status/stock fields |
| Quotes Line Items | `tbl3SQJ6AqAzXXk1L` | `sync_xero_quotes.py` | Read only |

## Table: Quoted

**Purpose:** Quote headers imported from Xero. Each record = one quote.

### Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| QuoteNumber | Text | Xero | Unique ID, e.g. `QU-0013` |
| QuoteID | Text | Xero | Xero UUID |
| Reference | Text | Xero | Customer PO number |
| Status | Single Select | Xero | DRAFT / SENT / ACCEPTED / INVOICED / DECLINED |
| QuoteDate | Date | Xero | Quote creation date |
| ExpiryDate | Date | Xero | Quote expiry |
| ContactName | Text | Xero | Company name |
| ContactEmail | Text | Xero | Contact email |
| ContactFirstName | Text | Xero | First name |
| ContactLastName | Text | Xero | Last name |
| ContactAccountNumber | Text | Xero | Xero account code |
| Currency | Text | Xero | Usually GBP |
| SubTotal | Currency | Xero | Total excl. tax |
| TotalTax | Currency | Xero | Tax amount |
| Total | Currency | Xero | Total incl. tax |
| TotalDiscount | Currency | Xero | Discount amount |
| Title | Text | Xero | Quote title |
| Summary | Long Text | Xero | Internal notes (contains lead times, batch schedules, etc.) |
| Terms | Long Text | Xero | Payment terms (may contain lead time info) |
| LineItemsCount | Number | Calculated | Number of line items |
| LineItemsSummary | Long Text | Calculated | Formatted line items breakdown |

### Scheduling Fields (written by this app)

| Field | Type | Options |
|-------|------|---------|
| Internal Job Type | Single Select | Cable Assembly, Stock/Parts, Mixed, Unknown |
| Internal Status | Single Select | Not scheduled, Scheduled, In Progress, Complete, Blocked |
| Urgency | Single Select | Low, Medium, High, Critical |
| Complexity | Single Select | Simple, Medium, Complex, Production |
| Order Size | Single Select | Micro (1-4), Small (5-10), Medium (11-20), Large (21-50), X Large (51+) |
| Target Build Date | Date | - |
| Expected Delivery Date | Date | - |
| Completion Date | Date | - |
| Scheduling Notes | Long Text | - |
| Supplier / PO Reference | Text | - |
| Last Reviewed | DateTime | Europe/London |
| Supplier Order Status | Single Select | Not ordered, Ordered, Part received, Received |

### Batch Order Fields (planned for Phase 4)

| Field | Type | Purpose |
|-------|------|---------|
| Is Batch Order | Checkbox | Flag for batch/repeat orders |
| Batch Frequency | Text | Monthly, Fortnightly, etc. |
| Total Batches | Number | Planned delivery count |
| Batches Completed | Number | Delivered so far |
| Estimated Lead Time | Text | Structured lead time |

**Total:** 24 Xero fields + 12 scheduling + 5 batch = **41 fields**

---

## Table: Quote Parts Requirements

**Purpose:** Parsed assembly components. Each record = one assembly line item broken into connectors and cable.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| QuoteNumber | Text | Links back to Quoted table |
| QuoteStatus | Single Select | Copied from quote status |
| CustomerName | Text | Copied from quote |
| AssemblySKU | Text | Original item code, e.g. `A30T60-200-1000` |
| AssemblyDescription | Text | Line item description (up to 150 chars) |
| AssemblyQty | Number | Quantity ordered |
| Connector1Code | Text | First connector code, e.g. `A30` |
| Connector1SKU | Text | SKU for connector 1, e.g. `CH-AP-200` |
| Connector1Qty | Number | Usually equals AssemblyQty |
| Connector2Code | Text | Second connector code |
| Connector2SKU | Text | SKU for connector 2 |
| Connector2Qty | Number | Usually equals AssemblyQty |
| CableCode | Text | Cable type code, e.g. `200` |
| CableLengthMM | Number | Length in millimetres |
| TotalCableLengthM | Number | (CableLengthMM x AssemblyQty) / 1000 |
| WorkStatus | Single Select | To Do / In Progress / Complete |
| Quote | Linked Record | Links to Quoted table record |

### Scheduling Fields

| Field | Type | Options |
|-------|------|---------|
| Line Target Build Date | Date | - |
| Line Build Status | Single Select | Blocked, Ready, In Progress, Complete |
| Line Urgency | Single Select | Low, Medium, High, Critical |
| Line Complexity | Single Select | Simple, Medium, Complex, Production |
| Line Scheduling Notes | Long Text | - |

### Stock Check-off Fields (planned for Phase 3)

| Field | Type | Purpose |
|-------|------|---------|
| Connector1 In Stock | Checkbox | Verified in stock |
| Connector2 In Stock | Checkbox | Verified in stock |
| Cable In Stock | Checkbox | Verified in stock |
| Parts Verified Date | Date | When last checked |
| Parts Verified By | Text | Who checked |

**Total:** 17 core + 5 scheduling + 5 stock = **27 fields**

---

## Table: Quotes Line Items

**Purpose:** Raw line items from Xero quotes. Read-only reference.

| Field | Type | Description |
|-------|------|-------------|
| QuoteNumber | Text | Quote reference |
| Description | Text | Line item description |
| ItemCode | Text | Assembly or product code |
| Quantity | Number | Quantity ordered |
| UnitAmount | Currency | Price per unit |
| LineAmount | Currency | Line total |
| DiscountAmount | Currency | Discount applied |
| DiscountRate | Number | Discount percentage |
| TaxAmount | Currency | Tax on line |
| TaxType | Text | Tax code |
| Quote | Linked Record | Links to Quoted table |

---

## Relationships

```
Quoted (1) ──< (many) Quote Parts Requirements
   |                    (linked via Quote field + QuoteNumber)
   |
   └──────< (many) Quotes Line Items
                     (linked via Quote field + QuoteNumber)
```

## API Patterns

### Endpoints

```
Base URL: https://api.airtable.com/v0/{BASE_ID}

Records:
  GET    /{TABLE_ID}                    # List (paginated, filterable)
  PATCH  /{TABLE_ID}/{RECORD_ID}        # Update single record
  PATCH  /{TABLE_ID}                    # Batch update (max 10 records)

Schema:
  GET    /meta/bases/{BASE_ID}/tables   # List tables + fields
```

### Rate Limits

| Constraint | Value |
|-----------|-------|
| Batch update size | 10 records max per request |
| Inter-batch delay | 250ms |
| Airtable base limit | 5 requests/second |
| Records per page | 100 max |

### TypeScript Types

All record types are defined in `src/types/airtable.ts`:
- `Quote` (QuoteFields + id)
- `BuildLine` (BuildLineFields + id)
- `QuoteLine` (QuoteLineFields + id)
- Enum types for all single-select fields

## Related Docs

- [Project Architecture](project_architecture.md) — Tech stack, data flow, design decisions
- [XeroAirtableSync Data Schema](../../../XeroAirtableSync/.agent/System/data_schema.md) — Full schema including reference tables, parsing rules, SKU mappings
