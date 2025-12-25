# Job Application Workflow Engine

A production-grade, multi-step job application system built with Next.js 16, React 19, React Hook Form, Zod, and Zustand.

## Features

### ✅ Multi-Step Form Flow
- **Step 1: Personal Information** - Name, email, phone, country
- **Step 2: Professional Details** - Experience, skills, current role, notice period
- **Step 3: Documents** - Resume upload (required), optional cover letter
- **Step 4: Review & Submit** - Complete review with edit navigation

### ✅ State Management
- **URL Sync**: Step navigation synced with query parameters (`/onboarding?step=2`)
- **Session Storage**: Auto-saves after each step completion
- **Global Store**: Zustand store for centralized state management
- **Local Buffering**: Form state managed locally to prevent unnecessary re-renders

### ✅ Validation
- **Zod Schemas**: Step-specific validation rules
- **Real-time Validation**: Form validation on change
- **Error Handling**: User-friendly error messages with ARIA labels
- **Conditional Logic**: Internship disclaimer for < 1 year experience

### ✅ Async Behavior & Error Handling
- **Retry Logic**: Exponential backoff for failed submissions
- **Error Modes**: Handles network errors, timeouts, validation errors, server errors
- **Loading States**: Clear feedback during submission
- **Data Preservation**: Form data preserved on errors

### ✅ Accessibility
- **ARIA Labels**: All inputs properly labeled
- **Error Announcements**: Screen reader friendly error messages
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling between steps
- **Semantic HTML**: Proper use of form elements and landmarks

### ✅ Architecture Highlights
- **Separation of Concerns**: Validation logic separated from UI
- **Testable Design**: Validation and state management can be tested independently
- **Type Safety**: Full TypeScript support
- **Maintainable**: Easy to add new steps or extend validation

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Zustand** - Global state management
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect to `/onboarding?step=1`.

### Build

```bash
npm run build
npm start
```

## Project Structure

Following feature-based architecture best practices:

```
workflow_engine/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── onboarding/
│   │   │   └── page.tsx              # Onboarding page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page (redirects)
│   │   └── globals.css               # Global styles
│   ├── components/                    # Shared/Global UI components
│   │   └── (empty - for future shared components)
│   ├── features/                     # Feature-based modules
│   │   └── onboarding/               # Onboarding feature
│   │       ├── api/                  # API/Service layer
│   │       │   └── submission.ts     # Submission logic with retry
│   │       ├── components/           # Feature-specific components
│   │       │   ├── step-1-personal-info.tsx
│   │       │   ├── step-2-professional-details.tsx
│   │       │   ├── step-3-documents.tsx
│   │       │   ├── step-4-review-submit.tsx
│   │       │   └── workflow-container.tsx
│   │       ├── hooks/                # Feature-specific hooks
│   │       │   └── use-step-navigation.ts
│   │       ├── types/                # Feature-specific types
│   │       │   ├── application.ts    # Domain types
│   │       │   └── schemas.ts        # Zod validation schemas
│   │       └── index.ts              # Public API (barrel export)
│   ├── hooks/                        # Global hooks (if any)
│   ├── lib/                          # Third-party configs
│   │   └── store/
│   │       └── application-store.ts  # Zustand store
│   ├── utils/                        # Pure helper functions
│   └── types/                        # Global TypeScript definitions
```

## Key Design Decisions

### State Management Pattern
- **Global Store (Zustand)**: Holds the "Master Record" of all completed steps
- **Local Hook (useState)**: Holds the "Draft" data for the current active step
- **Why?** Prevents global re-renders on every keystroke while preserving data when navigating between steps

### URL Sync
- Step navigation is synced with URL query parameters
- Allows deep linking and browser back/forward navigation
- State persists in sessionStorage for recovery on refresh

### Validation Architecture
- Validation logic is completely separated from UI components
- Zod schemas can be tested independently
- React Hook Form integrates with Zod via `@hookform/resolvers`

### File Upload Handling
- Files are stored in component state (not persisted to sessionStorage)
- File validation happens via Zod schema
- File size and type restrictions enforced

## Testing the Error Handling

The submission function includes simulated failure modes for testing:
- 10% chance of network error
- 5% chance of timeout
- 5% chance of validation error
- 5% chance of server error
- 70% chance of success

Retry logic with exponential backoff handles transient failures.

## Future Enhancements

- [ ] Add unit tests for validation schemas
- [ ] Add integration tests for form flows
- [ ] Add E2E tests with Playwright
- [ ] Implement file upload to actual backend
- [ ] Add progress persistence across browser sessions
- [ ] Add form analytics
- [ ] Add multi-language support

## License

MIT
