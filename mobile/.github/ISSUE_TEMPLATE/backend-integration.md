---
name: Backend Integration Issue
about: Request backend endpoint or report backend bug affecting mobile app
title: '[Backend] '
labels: backend-needed
assignees: ''
---

## Issue Type

- [ ] Missing Endpoint (need new API endpoint)
- [ ] Bug in Existing Endpoint
- [ ] Performance Issue
- [ ] Documentation Missing

## Context

**Mobile Screen/Feature:** [e.g., Trip Detail Screen, Places Search]  
**Priority:** [ ] High [ ] Medium [ ] Low

## Endpoint Details

**Method & Path:** [e.g., GET /trips/:id/weather]  
**Current Status:** [ ] Doesn't exist [ ] Exists but broken [ ] Exists but slow

## Problem Description

Clear description of the issue or what's needed.

## Expected Behavior

What the endpoint should do or return.

## Actual Behavior (for bugs)

What currently happens.

## Request/Response Examples

### Request

```json
{
  "example": "request body"
}
```

### Expected Response

```json
{
  "example": "expected response"
}
```

### Actual Response (for bugs)

```json
{
  "error": "actual response"
}
```

## Mobile Testing Details

**API URL:** [e.g., http://localhost:3002]  
**Flutter App Version:** [e.g., v0.1.0-dev]  
**Testing Date:** 2026-10-09  
**Device/Emulator:** [e.g., Android Pixel 7 Emulator]

## Steps to Reproduce (for bugs)

1. Step 1
2. Step 2
3. Step 3

## Workaround

**Current workaround in mobile app:**
- [ ] No workaround (blocking)
- [ ] Using mock data
- [ ] Using cached data
- [ ] Alternative approach: [describe]

**Code snippet (if applicable):**
```dart
// Temporary workaround
try {
  final data = await api.get('/endpoint');
  return data;
} catch (e) {
  // Fallback to mock
  return mockData;
}
```

## Impact

**Affected Features:**
- Feature 1
- Feature 2

**User Impact:**
- [ ] Feature completely blocked
- [ ] Feature degraded but usable
- [ ] Minor inconvenience

## Backend Context (if known)

**Relevant Backend Files:** [e.g., backend/src/trips/trips.service.ts]  
**Database Tables:** [e.g., trips, places]  
**Related Endpoints:** [e.g., GET /trips, POST /trips]

## Additional Context

Any other information that might help backend team.

## Checklist (for mobile team)

- [ ] Searched existing issues (not duplicate)
- [ ] Tested against latest backend version
- [ ] Provided complete request/response examples
- [ ] Described current workaround
- [ ] Assessed priority correctly

---

**For Backend Team:**

When implementing, please:
1. Comment on this issue when work starts
2. Update issue when deployed to staging
3. Tag @mobile-team when ready for integration testing
4. Provide curl/Postman examples for testing
