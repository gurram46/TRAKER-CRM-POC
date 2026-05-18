# Omnia Steels CRM — Master Context Document
> This is the single source of truth for the entire CRM application. Every page, component, color, interaction, and data model is described here. Build everything exactly as described. Use dummy data throughout — no backend integration needed yet.

---

## 1. Project Overview

**Client:** Omnia Steels Pvt Ltd
**Location:** Attapur, Hyderabad
**Industry:** Steel trading — they buy steel from vendors and sell to clients, managing logistics in between
**Purpose:** Replace their current WhatsApp + Excel workflow with a professional CRM that handles enquiries, quotations, vendor management, payments, and logistics

**Tech Stack:**
- React 18 + TypeScript
- Tailwind CSS
- React Router v6
- Recharts (for charts)
- jsPDF + html2canvas (for PDF generation)
- Lucide React (for icons)
- date-fns (for date formatting)

---

## 2. Design System

### Philosophy
Industrial luxury. Think Bloomberg Terminal meets a premium SaaS dashboard. Dense with information but never cluttered. Every pixel earns its place. This is a tool used by serious business people — it should feel like it costs money.

### Color Palette

```css
/* Base */
--bg-primary: #0A0C0F        /* Near black — main background */
--bg-secondary: #111318       /* Slightly lighter — sidebar, cards */
--bg-tertiary: #181C23        /* Card surfaces, table rows */
--bg-hover: #1E2330           /* Hover states */
--border: #1F2937             /* Subtle borders */
--border-accent: #2D3748      /* Slightly more visible borders */

/* Text */
--text-primary: #F1F5F9       /* Main text — near white */
--text-secondary: #94A3B8     /* Subtext, labels */
--text-muted: #475569          /* Very muted — placeholders */

/* Brand Accent */
--accent-primary: #3B82F6     /* Electric blue — primary actions, active states */
--accent-secondary: #1D4ED8   /* Darker blue — hover on primary */
--accent-glow: rgba(59,130,246,0.15)  /* Blue glow for cards/focus */

/* Status Colors */
--status-success: #10B981     /* Green — paid, delivered, active */
--status-warning: #F59E0B     /* Amber — pending, partial, in-transit */
--status-danger: #EF4444      /* Red — overdue, cancelled, urgent */
--status-info: #6366F1        /* Indigo — new, info states */
--status-neutral: #64748B     /* Gray — inactive, closed */

/* Steel Industry Accent */
--steel-gradient: linear-gradient(135deg, #1E3A5F 0%, #0F2035 100%)
--gold-accent: #D4A017        /* For premium highlights, total values */
```

### Typography

```css
/* Fonts — import from Google Fonts */
--font-display: 'Syne', sans-serif        /* Headers, nav items, stat numbers */
--font-body: 'DM Sans', sans-serif        /* Body text, tables, forms */
--font-mono: 'JetBrains Mono', monospace  /* IDs, amounts, codes */
```

Import string:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Spacing & Radius
```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
```

### Shadows
```css
--shadow-card: 0 4px 24px rgba(0,0,0,0.4)
--shadow-glow: 0 0 20px rgba(59,130,246,0.2)
--shadow-dropdown: 0 8px 32px rgba(0,0,0,0.6)
```

---

## 3. Layout Structure

### App Shell
The app has three structural zones:

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR (60px height, full width, fixed)            │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   SIDEBAR    │         MAIN CONTENT AREA            │
│   (240px)    │         (flex-1, scrollable)         │
│   (fixed)    │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Topbar
- Background: `--bg-secondary` with bottom border `--border`
- Left: Company logo — a small steel beam icon + "OMNIA STEELS" in Syne Bold, "CRM" in accent blue
- Center: Global search bar (fake — no functionality needed, just UI) with `Ctrl+K` hint
- Right: Notification bell with badge (3 notifications), user avatar with initials "RS" (Ram, Steels)

### Sidebar
- Background: `--bg-secondary`
- Right border: `1px solid --border`
- Top: 20px padding, company logo repeated small
- Nav sections with subtle section labels:

```
OVERVIEW
  □ Dashboard

OPERATIONS  
  □ RFQ Management
  □ Quotation Builder

RELATIONSHIPS
  □ Vendor Management
  □ Client Management (show as coming soon — greyed out)

FINANCE
  □ Payment Tracking

LOGISTICS
  □ Logistics Tracking
  □ Follow-up Tracker

SETTINGS (bottom, pinned)
  □ Settings (greyed out — coming soon)
```

- Active nav item: `--accent-primary` left border (3px), blue text, `--accent-glow` background
- Inactive: `--text-secondary`, transparent background
- Hover: `--bg-hover`
- Icons: Lucide React, 18px, consistent

---

## 4. Reusable Components

### StatCard
Used on dashboard. Props: title, value, change (%), icon, color variant
- Background: `--bg-tertiary`
- Border: `1px solid --border`
- Border-top: `3px solid [variant color]`
- Value: 28px Syne Bold, `--text-primary`
- Title: 12px DM Sans, `--text-secondary`, uppercase tracking
- Change badge: green/red pill showing % change vs last month
- Icon: 40x40 box with tinted background, top right

### DataTable
Used everywhere for lists.
- Header row: `--bg-secondary`, 11px uppercase DM Sans, `--text-muted`, letter-spacing
- Rows: alternating `--bg-tertiary` and transparent, 48px height
- Hover row: `--bg-hover`
- Borders: `1px solid --border` between rows
- Pagination at bottom: simple prev/next with page numbers

### StatusBadge
Pill component for statuses.
```
New       → indigo bg, indigo text
Sent      → blue bg, blue text  
Responded → amber bg, amber text
Converted → green bg, green text
Overdue   → red bg, red text
Paid      → green bg, green text
Partial   → amber bg, amber text
Unpaid    → red bg, red text
Pending   → gray bg, gray text
```
Style: `px-3 py-1 rounded-full text-xs font-medium`

### Modal
- Backdrop: `rgba(0,0,0,0.7)` blur
- Container: `--bg-secondary`, `--radius-lg`, `--shadow-dropdown`
- Header: title + X close button
- Footer: Cancel (ghost) + Confirm (primary) buttons

### Button Variants
```
Primary:  bg-accent-primary, white text, rounded-md, hover darken
Ghost:    transparent, border --border, --text-secondary, hover --bg-hover
Danger:   bg-red-500/10, red text, border red-500/20
Icon:     square, ghost variant, for action columns in tables
```

---

## 5. Pages — Detailed Specs

---

### PAGE 1: Dashboard (`/dashboard`)

**Purpose:** Command center. One glance should tell the user everything urgent.

#### Section A — Stat Cards Row (4 cards)
```
Card 1: Active RFQs
  Value: 12
  Change: +3 this week
  Icon: FileText (blue)
  Border-top: blue

Card 2: Pending Quotations  
  Value: 7
  Change: 2 overdue
  Icon: ClipboardList (amber)
  Border-top: amber

Card 3: Payments Pending
  Value: ₹4,82,000
  Change: 3 invoices overdue
  Icon: IndianRupee (red)
  Border-top: red

Card 4: Deliveries In Transit
  Value: 5
  Change: 1 delayed
  Icon: Truck (green)
  Border-top: green
```

#### Section B — Two Column Layout

**Left (60% width): Recent RFQ Activity**
Table with columns: RFQ ID, Client, Material, Qty (MT), Status, Date
Show 8 rows of dummy data. Materials should be realistic steel types:
- HR Coil, CR Sheet, MS Pipe, Angle Iron, TMT Bars, Chequered Plate, GI Sheet, Structural Steel

**Right (40% width): Follow-up Reminders**
List of 5 items showing overdue follow-ups.
Each item: client name, what it's about, days overdue (red badge), action button "Call Now"
Header shows "⚠ 5 Overdue" in red

#### Section C — Bottom Row Two Columns

**Left: Revenue This Month**
Recharts BarChart showing last 6 months revenue.
Bars in `--accent-primary` color, X axis months, Y axis in ₹ lakhs
Dummy data: [28L, 34L, 22L, 41L, 38L, 45L]

**Right: RFQ Status Breakdown**
Recharts PieChart/DonutChart showing RFQ statuses.
Colors: use status colors defined above.
Center text showing total: "47 Total RFQs"

---

### PAGE 2: RFQ Management (`/rfq`)

**Purpose:** Track every enquiry from creation to conversion.

#### Header Row
- Title: "RFQ Management" + count badge "47 RFQs"
- Right side: "New RFQ" primary button with Plus icon

#### Filter Bar
Five tab pills: All | New | Sent | Responded | Converted
Active tab: blue pill. Shows count in each tab.

#### Search + Filter Row
- Search input: "Search by client, material, RFQ ID..."
- Date range picker (UI only)
- Material filter dropdown

#### Main Table
Columns:
```
RFQ ID        → monospace font, --text-muted, e.g. #RFQ-2024-0047
Client Name   → bold, --text-primary
Material      → --text-secondary
Qty (MT)      → right-aligned, monospace
Required By   → date, color red if within 3 days
Vendor Sent   → count badge "3 vendors"
Status        → StatusBadge component
Created       → relative date "2 days ago"
Actions       → Eye icon, Edit icon, Convert icon (tooltip on hover)
```

Dummy data: 10-12 rows with realistic steel company names like:
Vijaya Constructions, Sri Lakshmi Steels, Prasad Infrastructure, KVR Builders, Srinivasa Pipes, Ravi Structures, Bharat Steel Corp, Amaravati Developers

#### New RFQ Modal
Form fields:
- Client Name (text input)
- Contact Number (text)
- Material Type (dropdown: HR Coil, CR Sheet, MS Pipe, Angle Iron, TMT Bars, GI Sheet, Structural Steel, Chequered Plate)
- Quantity in MT (number)
- Required By Date (date picker)
- Special Requirements (textarea)
- Select Vendors to Notify (multi-select checkboxes from vendor list)

---

### PAGE 3: Quotation Builder (`/quotations`)

**Purpose:** Build accurate quotations and generate PDF instantly.

#### Layout: Two panel side by side

**Left Panel (55%): Quote Form**

Section 1 — Client Details
- Client Name, Contact, Email, Billing Address

Section 2 — Material & Pricing
```
Material Type (dropdown)
Quantity (MT) — number input
Base Price per MT (₹) — number input  
GST % (dropdown: 5%, 12%, 18%)
Freight Charges (₹) — flat amount
Our Margin % — number input
```

Section 3 — Auto Calculated (read-only, updates live)
```
Material Cost    = Quantity × Base Price
GST Amount       = Material Cost × GST%
Freight          = entered value
Our Margin       = Material Cost × Margin%
─────────────────────────────────
TOTAL QUOTE      = Sum of all above
```
Show this as a mini breakdown card with gold accent on the total line.

**Right Panel (45%): Live PDF Preview**
Shows a styled quotation preview that updates as user types.

Quotation PDF layout:
```
┌─────────────────────────────────────┐
│  OMNIA STEELS PVT LTD               │
│  Attapur, Hyderabad | GST: XXXX     │
│                          QUOTATION  │
│  Quote #: QT-2024-0023              │
│  Date: [today]  Valid: 7 days       │
├─────────────────────────────────────┤
│  Bill To:                           │
│  [Client Name]                      │
│  [Address]                          │
├─────────────────────────────────────┤
│  Material    Qty    Rate    Amount  │
│  [row]                              │
├─────────────────────────────────────┤
│  Subtotal:          ₹X,XX,XXX       │
│  GST (18%):         ₹XX,XXX         │
│  Freight:           ₹X,XXX          │
│  ─────────────────────────          │
│  TOTAL:             ₹X,XX,XXX       │
└─────────────────────────────────────┘
```

Bottom of left panel: "Download PDF" primary button + "Save Quotation" ghost button

---

### PAGE 4: Vendor Management (`/vendors`)

**Purpose:** Know who supplies what, at what price, how reliably.

#### Two tabs at top: Vendors | Transporters

**Vendors Tab:**

Header: "38 Vendors" + "Add Vendor" button

Filter row: City filter | Material filter | Rating filter

Table columns:
```
Vendor Name    → bold
City           → with state
Materials      → tag pills (max 2 shown + "+N more")
Contact        → phone number, monospace
Last Price     → ₹/MT for primary material, monospace gold
Rating         → star display (filled/empty), out of 5
Last Order     → relative date
Status         → Active/Inactive badge
Actions        → View, Edit, WhatsApp icon button
```

Dummy data: 8-10 vendors, cities across Telangana and AP:
Hyderabad, Vijayawada, Visakhapatnam, Warangal, Guntur, Karimnagar

**Transporters Tab:**

Table columns:
```
Transporter    → name, bold
Coverage       → "Hyd → Vizag, Hyd → Vijayawada" etc.
Rate           → ₹ per MT per KM, monospace
Vehicle Types  → "10T, 20T, Flatbed" as small tags
Contact        → phone
Reliability    → progress bar (85%, 92% etc.) with color
Status         → Active/Inactive
Actions        → View, Edit, WhatsApp
```

---

### PAGE 5: Payment Tracking (`/payments`)

**Purpose:** Never lose track of who owes what.

#### Header Stats Row (3 cards)
```
Total Receivable: ₹12,40,000  (blue)
Received This Month: ₹7,20,000  (green)
Overdue Amount: ₹2,80,000  (red)
```

#### Filter tabs: All | Unpaid | Partial | Paid | Overdue

#### Table columns:
```
Invoice #      → monospace, e.g. INV-2024-0089
Client         → name bold
RFQ/Quote Ref  → linked reference, muted
Invoice Date   → date
Due Date       → red if past, green if future
Invoice Amt    → right-aligned, monospace
Paid Amt       → right-aligned, green monospace
Balance        → right-aligned, red if > 0
Status         → StatusBadge
Days Overdue   → red badge, only shows if overdue
Actions        → View Invoice, Record Payment, Send Reminder
```

Overdue rows: subtle red left border + very faint red row background tint

#### Record Payment Modal
Fields: Payment Date, Amount Received, Payment Mode (NEFT/RTGS/Cheque/Cash/UPI), Reference/UTR Number, Notes

---

### PAGE 6: Logistics Tracking (`/logistics`)

**Purpose:** Know where every order is, checkpoint by checkpoint.

#### Header: "Active Shipments" + count + "New Shipment" button

#### Shipment Cards Layout
Instead of a table, use cards in a 2-column grid.

Each card shows:
```
┌─────────────────────────────────────┐
│  SHP-2024-0034          [In Transit]│
│  Vijaya Constructions               │
│  50 MT HR Coil                      │
│  Transporter: Ravi Logistics        │
│                                     │
│  ●────●────●────○────○              │
│  Placed Dispatched  CP1  CP2  Delivered│
│         ↑ Current                   │
│                                     │
│  Last Update: Shadnagar Toll  2h ago│
│  ETA: Tomorrow 6:00 PM              │
└─────────────────────────────────────┘
```

Progress stepper:
- Completed steps: filled blue circle + blue line
- Current step: pulsing blue circle (CSS animation)
- Future steps: empty circle, gray line

Checkpoint names (realistic for Hyderabad routes):
Order Placed → Dispatched from Yard → Shadnagar Toll → Kurnool → Destination

Status colors:
- Delivered: green card left border
- In Transit: blue
- Delayed: red
- Pending Dispatch: amber

Dummy data: 6-8 shipments in various stages

---

### PAGE 7: Follow-up Tracker (`/followups`)

**Purpose:** Never let a lead or client go cold.

#### Header stats: Total Open (18) | Due Today (4) | Overdue (6) | Completed This Week (12)

#### Two column layout

**Left: Follow-up List (60%)**

Filter tabs: All | Today | Overdue | This Week | Completed

Each follow-up item (card style, not table):
```
┌─────────────────────────────────────┐
│  [Client Avatar initials]           │
│  Vijaya Constructions    [OVERDUE 3d]│
│  RE: RFQ-2024-0034 price revision   │
│  Last contact: May 12 via WhatsApp  │
│  Next: Call to confirm order        │
│                                     │
│  [Mark Done] [Reschedule] [WhatsApp]│
└─────────────────────────────────────┘
```

Overdue cards: red left border
Today cards: amber left border
Future cards: normal border

**Right: Quick Add Follow-up Form (40%)**
Fields:
- Client Name (dropdown or text)
- Related To (RFQ/Quotation/Payment — dropdown)
- Reference ID
- Follow-up Date
- Follow-up Type (Call/Email/WhatsApp/Visit)
- Notes
- Assign To (dropdown — dummy names)

Primary "Add Follow-up" button at bottom.

---

## 6. Dummy Data Guidelines

Use realistic Hyderabad/AP/Telangana context:
- Client names: Telugu business names (Vijaya, Srinivasa, Sri Lakshmi, Bharat, Amaravati, KVR, Prasad)
- Cities: Hyderabad, Vijayawada, Visakhapatnam, Warangal, Guntur, Karimnagar, Nalgonda
- Phone numbers: Start with 9, 10 digits
- GST numbers: Format XXXXX format
- Amounts: Realistic steel trading amounts (₹50,000 to ₹15,00,000 range)
- Quantities: 5 MT to 500 MT range
- Material prices: HR Coil ~₹52,000/MT, TMT Bars ~₹58,000/MT, CR Sheet ~₹61,000/MT

---

## 7. Micro-interactions & Polish

- Sidebar nav items: smooth left border slide-in on active
- StatCards: subtle scale-up (1.01) on hover
- Table rows: smooth background transition on hover
- Buttons: 150ms ease transition on all states
- Modals: fade + slight scale-up on open (scale 0.97 → 1)
- Status badges: no animation, keep static
- Numbers on dashboard: count-up animation on first load
- Page transitions: fade in (opacity 0 → 1, 200ms)
- Loading states: use skeleton screens (animated gradient shimmer) not spinners

---

## 8. Responsive Behavior

Primary target: Desktop (1280px+)
Secondary: Tablet (768px - 1280px) — sidebar collapses to icon-only
Mobile: Out of scope for demo

---

## 9. File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AppShell.tsx
│   ├── ui/
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DataTable.tsx
│   │   ├── Modal.tsx
│   │   └── Button.tsx
│   └── charts/
│       ├── RevenueChart.tsx
│       └── RFQDonutChart.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── RFQManagement.tsx
│   ├── QuotationBuilder.tsx
│   ├── VendorManagement.tsx
│   ├── PaymentTracking.tsx
│   ├── LogisticsTracking.tsx
│   └── FollowupTracker.tsx
├── data/
│   └── dummyData.ts       ← all mock data lives here
├── styles/
│   └── globals.css        ← CSS variables defined here
└── App.tsx                ← Router setup
```

---

## 10. First Prompt to Run in Antigravity

Paste this as your very first message:

> "Read this entire context document carefully before writing any code. This is the master spec for a CRM application for Omnia Steels Pvt Ltd, a steel trading company in Hyderabad. Set up the complete React + TypeScript + Tailwind project with the exact design system, color palette, typography, and file structure described. Create the AppShell with Sidebar and Topbar first. Then implement each page one by one in the exact order listed. Use all dummy data as specified. Do not deviate from the design system. Prioritize visual quality — this is a client demo that must impress."

Then attach this markdown file directly to that message.

---

*Document Version: 1.0 | Omnia Steels CRM Demo*
