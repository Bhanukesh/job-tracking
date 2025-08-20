# Development Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local API URLs
   ```

3. **Generate API client:**
   ```bash
   pnpm generate-api
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

## API Integration

The frontend connects to the Python API backend. Make sure the Python API is running on the configured port.

### Generated API Hooks

After running `pnpm generate-api`, you'll have access to:
- `useGetJobApplicationsQuery()` - Fetch all applications
- `useCreateJobApplicationMutation()` - Create new application
- `useUpdateJobApplicationMutation()` - Update existing application
- `useDeleteJobApplicationMutation()` - Delete application

### Environment Variables

- `NEXT_PUBLIC_PYTHON_API_URL` - Python API base URL (required)
- `NEXT_PUBLIC_ENABLE_REDUX_DEV_TOOLS` - Enable Redux DevTools (optional)

## Common Issues

### "API hooks not found" Error
Run `pnpm generate-api` to generate the latest API client from the backend OpenAPI spec.

### "fetch is not available" Warning
This is expected in SSR environment and doesn't affect functionality.

### "Cannot assign to read only property" Error
RTK Query returns immutable arrays. Always create a copy before using mutating methods:
```tsx
// ❌ Wrong - will throw error
const sorted = applications.sort(...)

// ✅ Correct - create copy first
const sorted = [...applications].sort(...)

// ✅ Even better - use utility function
import { safeSortArray } from "@/lib/utils"
const sorted = safeSortArray(applications, (a, b) => ...)
```

**Why this happens:** RTK Query uses Immer under the hood which makes returned data immutable to prevent accidental mutations. Methods like `sort()`, `reverse()`, `push()`, etc. will throw errors on immutable arrays.

### "Cannot read properties of undefined" Error
This happens when components expect props that aren't provided:
```tsx
// ❌ Wrong - missing required prop
<EditJobModal trigger={<Button>Edit</Button>} />

// ✅ Correct - provide job data
<EditJobModal job={application} trigger={<Button>Edit</Button>} />
```

### Status Value Mismatch
Make sure status values match between frontend and backend:
- Use "Offer" (singular), not "Offers" (plural)
- Check both AddJobModal and EditJobModal dropdowns

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm generate-api` - Generate API client from OpenAPI spec