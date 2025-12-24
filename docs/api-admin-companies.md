# Admin Companies API

## GET /api/admin/companies

Returns a paginated list of all companies for admin management.

### Authorization

Requires authenticated admin user (userType = 2)

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | int | No | 1 | Page number |
| `pageSize` | int | No | 20 | Items per page |
| `search` | string | No | - | Search by company name or email |
| `tier` | int | No | - | Filter by subscription tier (0=Free, 1=Starter, 2=Pro) |

### Response

**Status: 200 OK**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "userId": "string",
        "companyName": "string",
        "email": "string",
        "industry": "string | null",
        "companySize": "string | null",
        "website": "string | null",
        "subscriptionTier": 0,
        "subscriptionExpiresAt": "2024-01-01T00:00:00Z | null",
        "messagesRemaining": 10,
        "shortlistsCount": 5,
        "savedCandidatesCount": 25,
        "createdAt": "2024-01-01T00:00:00Z",
        "lastActiveAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalCount": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### Enum Values

#### subscriptionTier
| Value | Name |
|-------|------|
| 0 | Free |
| 1 | Starter |
| 2 | Pro |

---

## PUT /api/admin/companies/{companyId}/messages

Update a company's remaining message count.

### Authorization

Requires authenticated admin user (userType = 2)

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `companyId` | string | The company's ID |

### Request Body

```json
{
  "messagesRemaining": 50
}
```

### Response

**Status: 200 OK**

```json
{
  "success": true
}
```
