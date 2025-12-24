# Admin Candidates API

## GET /api/admin/candidates

Returns a paginated list of all candidates for admin management.

### Authorization

Requires authenticated admin user (userType = 2)

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | int | No | 1 | Page number |
| `pageSize` | int | No | 20 | Items per page |
| `search` | string | No | - | Search by name or email |
| `visible` | bool | No | - | Filter by profile visibility |

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
        "firstName": "string | null",
        "lastName": "string | null",
        "email": "string",
        "desiredRole": "string | null",
        "availability": 0,
        "seniorityEstimate": 0,
        "profileVisible": true,
        "skillsCount": 0,
        "profileViewsCount": 0,
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

#### availability
| Value | Name |
|-------|------|
| 0 | Open |
| 1 | NotNow |
| 2 | Passive |

#### seniorityEstimate
| Value | Name |
|-------|------|
| 0 | Junior |
| 1 | Mid |
| 2 | Senior |
| 3 | Lead |
| 4 | Principal |

---

## PUT /api/admin/candidates/{candidateId}/visibility

Toggle a candidate's profile visibility.

### Authorization

Requires authenticated admin user (userType = 2)

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `candidateId` | string | The candidate's ID |

### Request Body

```json
{
  "visible": true
}
```

### Response

**Status: 200 OK**

```json
{
  "success": true
}
```
