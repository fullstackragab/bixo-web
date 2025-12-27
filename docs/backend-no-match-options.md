# Backend Implementation: No-Match Options

When no suitable candidates are found, admin can choose one of three options. This document describes the backend implementation for Options A and B (Option C already exists as `/no-match`).

---

## Option A: Suggest Adjusting the Brief

### Endpoint

`POST /api/admin/shortlists/{id}/suggest-adjustment`

### Request

```json
{
  "message": "We've reviewed the role and searched our current candidate pool..."
}
```

### Backend Logic

```text
1. Validate shortlist exists and is in processing/matching state
2. Set shortlist status = 'awaiting_adjustment' (new status)
3. Store message in shortlist.adjustment_suggestion
4. Send email to company:
   - Subject: "Suggestion for your {roleTitle} search"
   - Include the admin's message
   - Include link to update requirements
   - Include link to close request
5. Log email in shortlist_emails table with event = 'AdjustmentSuggested'
6. Return success
```

### Email Template

```
Subject: Suggestion for your {roleTitle} search

Hi {companyName},

{admin_message}

You can:
• Update your requirements: {link_to_edit}
• Close this request: {link_to_close}

If you have questions, reply to this email.

— The Bixo Team
```

---

## Option B: Extend the Search Window

### Endpoint

`POST /api/admin/shortlists/{id}/extend-search`

### Request

```json
{
  "message": "We haven't found the right match yet...",
  "extendDays": 14
}
```

### Backend Logic

```text
1. Validate shortlist exists and is in processing/matching state
2. Set shortlist.search_extended_at = now()
3. Set shortlist.search_deadline = now() + extendDays
4. Keep status = 'matching' (no change)
5. Store message in shortlist.extension_notes
6. Send email to company:
   - Subject: "Update on your {roleTitle} search"
   - Include the admin's message
   - Reassure: no action needed
7. Log email in shortlist_emails table with event = 'SearchExtended'
8. Return success
```

### Email Template

```
Subject: Update on your {roleTitle} search

Hi {companyName},

{admin_message}

No action is needed from you. We'll be in touch when we have candidates to share.

— The Bixo Team
```

---

## Database Changes

```sql
-- Add new columns to shortlists table
ALTER TABLE shortlists ADD COLUMN adjustment_suggestion TEXT NULL;
ALTER TABLE shortlists ADD COLUMN search_extended_at TIMESTAMP NULL;
ALTER TABLE shortlists ADD COLUMN search_deadline TIMESTAMP NULL;
ALTER TABLE shortlists ADD COLUMN extension_notes TEXT NULL;

-- Add new email event types
-- In ShortlistEmailEvent enum:
-- AdjustmentSuggested = 4
-- SearchExtended = 5

-- Optional: Add new status
-- In ShortlistStatus enum:
-- AwaitingAdjustment = 9
```

---

## Summary

| Option | Endpoint | Status Change | Email Event | Charge |
|--------|----------|---------------|-------------|--------|
| A: Adjust Brief | `/suggest-adjustment` | → `awaiting_adjustment` | `AdjustmentSuggested` | None yet |
| B: Extend Search | `/extend-search` | No change (stays `matching`) | `SearchExtended` | None yet |
| C: Close No Charge | `/no-match` (existing) | → `cancelled` | `NoMatch` | Released |

---

## Frontend Integration

Once backend is implemented, update the frontend handlers in `app/admin/shortlists/[id]/page.tsx`:

```typescript
// Option A: Suggest Adjustment
const handleSuggestAdjustment = async () => {
  const res = await api.post(`/admin/shortlists/${shortlistId}/suggest-adjustment`, {
    message: outcomeReason.trim(),
  });
  if (res.success) {
    setShowOutcomeModal(false);
    await loadShortlist();
  } else {
    setError(res.error || 'Failed to send suggestion');
  }
};

// Option B: Extend Search
const handleExtendSearch = async () => {
  const res = await api.post(`/admin/shortlists/${shortlistId}/extend-search`, {
    message: outcomeReason.trim(),
    extendDays: 14,
  });
  if (res.success) {
    setShowOutcomeModal(false);
    await loadShortlist();
  } else {
    setError(res.error || 'Failed to extend search');
  }
};
```
