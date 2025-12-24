# Admin Shortlists API - Backend Requirements

## Endpoint: Get Shortlist Detail

```
GET /admin/shortlists/{id}
```

### Required Response Format

```json
{
  "success": true,
  "data": {
    "id": "guid",
    "companyId": "guid",
    "companyName": "string",
    "roleTitle": "string",
    "techStackRequired": ["React", "Node.js"],
    "seniorityRequired": "junior|mid|senior|lead|principal",
    "locationPreference": "string",
    "hiringLocation": {
      "isRemote": true,
      "country": "string",
      "city": "string",
      "timezone": "string",
      "displayText": "Remote"
    },
    "remoteAllowed": true,
    "additionalNotes": "string",
    "status": "pending|processing|completed|cancelled",
    "pricePaid": 0.00,
    "createdAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:00:00Z",
    "candidatesCount": 10,
    "previousRequestId": "guid|null",
    "pricingType": "new|follow_up|free_regen",
    "followUpDiscount": 0.00,
    "newCandidatesCount": 8,
    "repeatedCandidatesCount": 2,
    "isFollowUp": false,
    "candidates": [
      {
        "id": "guid",
        "candidateId": "guid",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "desiredRole": "string",
        "seniorityEstimate": "senior",
        "availability": 0,
        "rank": 1,
        "matchScore": 85,
        "matchReason": "string",
        "adminApproved": false,
        "skills": ["React", "TypeScript", "Node.js"],
        "isNew": true,
        "previouslyRecommendedIn": "guid|null",
        "reInclusionReason": "string|null",
        "statusLabel": "New"
      }
    ],
    "chain": [
      {
        "id": "guid",
        "roleTitle": "string",
        "createdAt": "2024-01-01T00:00:00Z",
        "candidatesCount": 5
      }
    ]
  }
}
```

---

## Required Changes from Current Backend Response

The following changes are needed for the frontend to display candidates correctly:

### 1. Rename `topSkills` to `skills`

```diff
- "topSkills": ["React", "Node.js"]
+ "skills": ["React", "Node.js"]
```

### 2. Change `availability` from string to number

```diff
- "availability": "immediate|twoWeeks|oneMonth|flexible"
+ "availability": 0
```

**Mapping:**
| Current String | New Number | Frontend Display |
|----------------|------------|------------------|
| `"immediate"` | `0` | "Open" |
| `"twoWeeks"` | `0` | "Open" |
| `"oneMonth"` | `1` | "Passive" |
| `"flexible"` | `1` | "Passive" |

Or use this mapping if preferred:
- `0` = Open (actively looking)
- `1` = Passive (open to opportunities)
- `2` = NotNow (not currently looking)

### 3. Add `email` field to candidates

```diff
  {
    "candidateId": "guid",
    "firstName": "string",
    "lastName": "string",
+   "email": "string",
    ...
  }
```

The email is displayed when firstName/lastName are missing.

### 4. Add `adminApproved` field to candidates

```diff
  {
    "candidateId": "guid",
    ...
    "rank": 1,
+   "adminApproved": false,
    ...
  }
```

This boolean tracks whether an admin has approved the candidate for the shortlist. Default to `false` for new candidates.

---

## Complete Candidate Object Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Shortlist candidate record ID |
| `candidateId` | string | **Yes** | Candidate's unique ID (used for updates) |
| `firstName` | string \| null | No | First name |
| `lastName` | string \| null | No | Last name |
| `email` | string | **Yes** | Candidate email (displayed if name missing) |
| `desiredRole` | string \| null | No | Candidate's desired role |
| `seniorityEstimate` | string | No | `"junior"`, `"mid"`, `"senior"`, `"lead"`, `"principal"` |
| `skills` | string[] | **Yes** | Array of skills (use `[]` if empty, NOT null) |
| `matchScore` | number | **Yes** | Match percentage (0-100) |
| `matchReason` | string \| null | No | Explanation of match |
| `rank` | number | **Yes** | Ranking position |
| `availability` | number | **Yes** | `0` = Open, `1` = Passive, `2` = NotNow |
| `adminApproved` | boolean | **Yes** | Whether admin approved this candidate |
| `isNew` | boolean | No | True if new in this shortlist |
| `previouslyRecommendedIn` | string \| null | No | Previous shortlist ID (if repeated) |
| `reInclusionReason` | string \| null | No | Reason for re-inclusion |
| `statusLabel` | string \| null | No | Display label ("New" or "Previously recommended") |

---

## Summary of Changes

| Field | Current | Required |
|-------|---------|----------|
| `topSkills` | `string[]` | Rename to `skills` |
| `availability` | `string` enum | Change to `number` (0, 1, 2) |
| `email` | missing | Add field |
| `adminApproved` | missing | Add field (boolean, default: false) |

---

## Other Endpoints

### Update Candidate Rankings

```
PUT /admin/shortlists/{id}/rankings
```

#### Request Body

```json
{
  "rankings": [
    {
      "candidateId": "guid",
      "rank": 1,
      "adminApproved": true
    }
  ]
}
```

#### Response

```json
{
  "success": true
}
```

---

### Update Shortlist Status

```
PUT /admin/shortlists/{id}/status
```

#### Request Body

```json
{
  "status": "processing"
}
```

Valid status values: `"pending"`, `"processing"`, `"completed"`, `"cancelled"`

#### Response

```json
{
  "success": true
}
```

---

### Deliver Shortlist

```
POST /admin/shortlists/{id}/deliver
```

Marks the shortlist as completed and notifies the company.

#### Response

```json
{
  "success": true
}
```

---

### Run Matching Algorithm

```
POST /admin/shortlists/{id}/match
```

Runs the matching algorithm to find candidates for this shortlist.

#### Response

```json
{
  "success": true
}
```

---

### Send Message to Candidate

```
POST /api/admin/shortlists/{id}/message
```

Sends a message to a candidate in the shortlist.

#### Request Body

```json
{
  "candidateId": "guid",
  "subject": "string (optional)",
  "content": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candidateId` | string | Yes | The candidate's unique ID |
| `subject` | string | No | Email subject line (optional) |
| `content` | string | Yes | Message body content |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "guid",
    "fromCompanyName": "Acme Corp",
    "toCandidateId": "guid",
    "toCandidateName": "John Doe",
    "subject": "Message from Acme Corp",
    "content": "Hello...",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Message sent"
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Candidate not found in shortlist"
}
```
