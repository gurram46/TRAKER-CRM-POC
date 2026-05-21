# Omnia Steels CRM — REST API Specification

This document serves as the exact contract between the frontend and backend applications. Both frontend (React) and backend (Node.js/Express) must adhere strictly to these data structures and endpoints.

---

## 1. Global Configurations

**Base URL:**
`http://localhost:3001/api/v1`

**Authentication Header:**
All protected routes must include a Bearer token in the request headers:
```http
Authorization: Bearer <JWT_TOKEN>
```

**Standard Error Response Format:**
Whenever an endpoint fails (4xx or 5xx), the response body must follow this exact format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message detailing what went wrong."
  }
}
```

---

## 2. RFQ Management & New Enquiries

### Get All RFQs
- **Method:** `GET`
- **URL:** `/rfqs`
- **Status Codes:** 200 OK, 401 Unauthorized
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "RFQ-2024-0047",
      "client": "Vijaya Constructions",
      "contact": "9876543210",
      "material": "HR Coil",
      "quantity": 120,
      "requiredBy": "2024-12-22",
      "vendorsSent": 3,
      "status": "New", 
      "created": "2024-12-18T10:00:00Z"
    }
  ]
}
```
*(Note: Valid statuses are "New", "Sent", "Responded", "Converted", "Lost")*

### Create New Enquiry (RFQ)
- **Method:** `POST`
- **URL:** `/rfqs`
- **Status Codes:** 201 Created, 400 Bad Request
- **Request Body:**
```json
{
  "clientName": "string",
  "contactNumber": "string",
  "requiredBy": "YYYY-MM-DD",
  "remarks": "string",
  "lineItems": [
    {
      "itemCode": "string",
      "specification": "string",
      "grade": "string",
      "qty": 0,
      "uom": "string"
    }
  ]
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "RFQ-2024-0048",
    "status": "New",
    "message": "RFQ created successfully"
  }
}
```

### Import RFQ from Email (Zoho + Gemini Integration)
- **Method:** `POST`
- **URL:** `/rfqs/import-email`
- **Status Codes:** 200 OK, 500 Internal Server Error
- **Request Body:** None (Backend connects to Zoho and extracts data using Gemini).
- **Response:**
```json
{
  "success": true,
  "message": "Processed 3 emails",
  "data": {
    "importedCount": 3,
    "rfqIds": ["RFQ-2024-0049", "RFQ-2024-0050", "RFQ-2024-0051"]
  }
}
```

---

## 3. Item Master

### Get All Items
- **Method:** `GET`
- **URL:** `/items`
- **Status Codes:** 200 OK
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "ITM-001",
      "name": "HR Coil 2.5mm",
      "category": "HR Coil",
      "specification": "2.5mm x 1250mm",
      "grade": "IS 2062 E250",
      "uom": "MT"
    }
  ]
}
```

### Create New Item
- **Method:** `POST`
- **URL:** `/items`
- **Status Codes:** 201 Created
- **Request Body:**
```json
{
  "code": "string",
  "name": "string",
  "category": "string",
  "specification": "string",
  "grade": "string",
  "uom": "string"
}
```
- **Response:** Same as requested object.

---

## 4. Quotation Builder

### Get All Quotations
- **Method:** `GET`
- **URL:** `/quotations`
- **Status Codes:** 200 OK
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "QT-2024-001",
      "rfqId": "RFQ-2024-0047",
      "client": "Vijaya Constructions",
      "totalValue": 550000,
      "validUntil": "2024-12-25",
      "status": "Draft"
    }
  ]
}
```
*(Note: Valid statuses are "Draft", "Sent", "Accepted", "Rejected")*

### Create Quotation
- **Method:** `POST`
- **URL:** `/quotations`
- **Status Codes:** 201 Created
- **Request Body:**
```json
{
  "rfqId": "string",
  "lineItems": [
    {
      "itemCode": "string",
      "qty": 0,
      "basePrice": 0,
      "marginPct": 0,
      "transportPerMT": 0,
      "gstPct": 0
    }
  ]
}
```
- **Response:**
```json
{
  "success": true,
  "data": { "id": "QT-2024-002", "totalValue": 1200000, "status": "Draft" }
}
```

---

## 5. Relationships & Logistics

### Get All Vendors
- **Method:** `GET`
- **URL:** `/vendors`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "V-001",
      "name": "Narayana Steel Suppliers",
      "city": "Hyderabad",
      "state": "Telangana",
      "materials": ["HR Coil", "CR Sheet"],
      "contact": "9876543210",
      "rating": 4.5,
      "status": "Active"
    }
  ]
}
```

### Get All Transporters
- **Method:** `GET`
- **URL:** `/transporters`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "T-001",
      "name": "Ravi Logistics",
      "coverage": "Hyd → Vizag",
      "rate": 3.2,
      "vehicleTypes": ["10T", "20T"],
      "reliability": 92
    }
  ]
}
```

### Get Active Shipments (Logistics Tracking)
- **Method:** `GET`
- **URL:** `/shipments`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "SHP-2024-0034",
      "client": "Vijaya Constructions",
      "transporter": "Ravi Logistics",
      "status": "In Transit",
      "eta": "Tomorrow 6:00 PM",
      "lastLocation": "Shadnagar Toll"
    }
  ]
}
```

---

## 6. Financials

### Get Payment Tracking Data
- **Method:** `GET`
- **URL:** `/payments`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "P-001",
      "invoiceNo": "INV-2024-0089",
      "client": "Vijaya Constructions",
      "invoiceAmt": 624000,
      "paidAmt": 624000,
      "dueDate": "2024-12-15",
      "status": "Paid"
    }
  ]
}
```

### Record a Payment
- **Method:** `POST`
- **URL:** `/payments/:id/record`
- **Request Body:**
```json
{
  "amountPaid": 0,
  "paymentDate": "YYYY-MM-DD",
  "paymentMethod": "NEFT"
}
```
- **Response:**
```json
{
  "success": true,
  "data": { "newStatus": "Paid", "remainingBalance": 0 }
}
```

---

## 7. Follow-up & Dashboard

### Get Follow-ups
- **Method:** `GET`
- **URL:** `/followups`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "FU-001",
      "client": "Vijaya Constructions",
      "subject": "Price revision discussion",
      "dueDate": "2024-12-15",
      "status": "Overdue"
    }
  ]
}
```

### Get Dashboard Stats
- **Method:** `GET`
- **URL:** `/dashboard/stats`
- **Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 4500000,
    "activeRFQs": 24,
    "pendingPayments": 1200000,
    "rfqStatusBreakdown": [
      { "name": "New", "value": 12 },
      { "name": "Converted", "value": 10 }
    ],
    "revenueTrends": [
      { "month": "Nov", "revenue": 38 },
      { "month": "Dec", "revenue": 45 }
    ]
  }
}
```

---

## 8. Communications

### Generate WhatsApp Message (Optional API if backend generation is needed)
- **Method:** `POST`
- **URL:** `/communications/whatsapp/generate`
- **Request Body:**
```json
{
  "eventType": "string",
  "recordId": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "messageText": "Hello Vijaya Constructions...\n\nThank you for choosing Omnia Steels."
  }
}
```
*(Note: The frontend currently generates this client-side based on templates. This endpoint allows moving template generation logic strictly to the backend).*
