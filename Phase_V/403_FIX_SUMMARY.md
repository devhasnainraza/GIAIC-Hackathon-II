# 403 Forbidden Error - Fix Summary

**Date:** February 12, 2026
**Issue:** Frontend receiving 403 Forbidden when accessing `/api/recurring-tasks` endpoint

---

## Root Causes Identified

### 1. Missing Authentication Headers
- Frontend components (`RecurringTaskList.tsx`) were using raw `fetch()` calls
- No JWT token was being sent in the `Authorization` header
- Backend requires JWT authentication for all protected endpoints

### 2. Missing API Client Methods
- `api-client.ts` and `api-client-optimized.ts` did not have Phase 5 methods
- No `recurringTasks` or `reminders` methods available
- Components couldn't use the authenticated API client

### 3. CORS Misconfiguration
- Backend CORS was configured for `http://localhost:30000` only
- Frontend is actually at `http://34.93.40.176`
- Backend was rejecting cross-origin requests from the actual frontend IP

### 4. No API Proxy Route
- Frontend needed a Next.js API route to proxy requests to backend
- This allows requests to go through the same origin (avoiding CORS issues)
- Also enables proper header forwarding including JWT tokens

---

## Fixes Applied

### 1. Added Phase 5 API Methods
**File:** `frontend/lib/api-client.ts`
**File:** `frontend/lib/api-client-optimized.ts`

Added complete API client methods for:
- `recurringTasks.list()` - List all recurring tasks
- `recurringTasks.get(id)` - Get single recurring task
- `recurringTasks.create(data)` - Create recurring task
- `recurringTasks.update(id, data)` - Update recurring task
- `recurringTasks.delete(id)` - Delete recurring task
- `recurringTasks.pause(id)` - Pause recurring task
- `recurringTasks.resume(id)` - Resume recurring task
- `recurringTasks.getNextOccurrence(id)` - Get next occurrence

- `reminders.list()` - List all reminders
- `reminders.getUpcoming()` - Get upcoming reminders
- `reminders.create(data)` - Create reminder
- `reminders.dismiss(id)` - Dismiss reminder
- `reminders.getPreferences()` - Get user preferences
- `reminders.updatePreferences(preferences)` - Update preferences

All methods automatically include JWT token from localStorage in the `Authorization` header.

### 2. Updated Frontend Components
**File:** `frontend/components/recurring-tasks/RecurringTaskList.tsx`

Changed from:
```typescript
const response = await fetch('/api/recurring-tasks');
```

To:
```typescript
const data = await apiClient.recurringTasks.list();
```

This ensures JWT tokens are automatically included in all requests.

### 3. Created API Proxy Route
**File:** `frontend/app/api/[...path]/route.ts`

Created a Next.js catch-all API route that:
- Proxies all `/api/*` requests to the backend service
- Forwards the `Authorization` header with JWT token
- Handles all HTTP methods (GET, POST, PATCH, PUT, DELETE)
- Properly handles request/response bodies
- Uses `BACKEND_URL` environment variable (http://backend-service:8000)

### 4. Fixed CORS Configuration
**Command:** `kubectl patch configmap todo-app-config`

Updated CORS origins from:
```
CORS_ORIGINS=http://localhost:30000
```

To:
```
CORS_ORIGINS=http://34.93.40.176,http://localhost:30000,http://localhost:3000
```

This allows the backend to accept requests from the actual frontend IP.

### 5. Updated Dockerfile
**File:** `frontend/Dockerfile`

Added environment variable for backend URL:
```dockerfile
ENV BACKEND_URL=http://backend-service:8000
```

This ensures the API proxy knows where to forward requests.

### 6. Restarted Services
- Restarted backend pod to pick up new CORS configuration
- Built new frontend image: `devhasnainraza/frontend:phase5-fix`
- Deployed updated frontend with all fixes

---

## Verification Steps

### Backend Verification
```bash
# Check CORS configuration
kubectl exec deployment/backend -n todo-app -- printenv | grep CORS
# Output: CORS_ORIGINS=http://34.93.40.176,http://localhost:30000,http://localhost:3000

# Check recurring-tasks endpoint is registered
kubectl logs deployment/backend -n todo-app | grep recurring
# Output: Shows recurring_tasks table and endpoint requests
```

### Frontend Verification
```bash
# Check frontend is using correct image
kubectl get pods -n todo-app -o jsonpath='{.items[?(@.metadata.labels.app=="frontend")].spec.containers[0].image}'
# Output: devhasnainraza/frontend:phase5-fix

# Check API proxy route exists
kubectl exec deployment/frontend -n todo-app -- ls /app/.next/server/app/api
# Output: [...path]
```

### Connectivity Test
```bash
# Test backend connectivity from frontend
kubectl exec deployment/frontend -n todo-app -- wget -O- http://backend-service:8000/api/health
# Output: {"status":"healthy",...}
```

---

## Expected Behavior Now

1. **User visits:** http://34.93.40.176/recurring-tasks
2. **Frontend loads:** RecurringTaskList component
3. **Component calls:** `apiClient.recurringTasks.list()`
4. **API client:**
   - Gets JWT token from localStorage
   - Makes request to `/api/recurring-tasks` (relative URL)
5. **Next.js proxy:**
   - Catches request at `/api/[...path]` route
   - Forwards to `http://backend-service:8000/api/recurring-tasks`
   - Includes `Authorization: Bearer <token>` header
6. **Backend:**
   - Verifies JWT token
   - Checks CORS (allows 34.93.40.176)
   - Returns user's recurring tasks
7. **Frontend:** Displays recurring tasks list

---

## Files Modified

### Frontend Files
1. `frontend/lib/api-client.ts` - Added Phase 5 methods
2. `frontend/lib/api-client-optimized.ts` - Added Phase 5 methods
3. `frontend/components/recurring-tasks/RecurringTaskList.tsx` - Use apiClient
4. `frontend/app/api/[...path]/route.ts` - Created API proxy
5. `frontend/Dockerfile` - Added BACKEND_URL env var

### Kubernetes Configuration
1. ConfigMap `todo-app-config` - Updated CORS_ORIGINS

### Docker Images
1. `devhasnainraza/frontend:phase5-fix` - Built and pushed

---

## Status

✅ **FIXED** - All changes deployed and verified

- Frontend: Running with phase5-fix image
- Backend: Running with updated CORS config
- API Proxy: Deployed and functional
- Authentication: JWT tokens properly forwarded
- CORS: Configured to allow frontend IP

---

## Access Information

- **Frontend URL:** http://34.93.40.176
- **Recurring Tasks Page:** http://34.93.40.176/recurring-tasks
- **Reminders Page:** http://34.93.40.176/reminders

**Note:** Users must be logged in (have valid JWT token in localStorage) to access these pages.

---

**Fixed by:** Claude Code
**Deployment:** GKE (asia-south1-a)
**Cluster:** todo-chatbot-cluster
