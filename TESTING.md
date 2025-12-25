# Testing Strategy: Contract-Based Testing

This document outlines the contract-based testing approach for the job application flow.

## Philosophy

**Think in terms of contracts, not coverage.**

Tests exist to protect behavior contracts, not to achieve coverage metrics. If a test breaks during a refactor without a behavior change, delete the test.

## Test Categories

### 1. Unit Testing - Validation Logic

**Purpose:** Protect rules and decisions

**Location:** `src/features/onboarding/__tests__/schemas.test.ts`

**What to Test:**

- ✅ Email format validation
- ✅ Phone number rules
- ✅ Experience must be numeric
- ✅ Minimum one skill selected
- ✅ Resume file type and size validation
- ✅ Conditional rules (e.g., < 1 year experience → internship disclaimer)

**Contract:** Validation rules are pure functions that survive UI refactors.

### 2. Unit Testing - Derived State Logic

**Purpose:** Protect derived state calculations

**Location:** `src/lib/store/__tests__/application-store.test.ts`

**What to Test:**

- ✅ Step completion calculation
- ✅ "Can proceed to next step" logic
- ✅ "Is form submittable" logic
- ✅ Progress percentage computation

**Contract:** Derived state should never be manually stored. Tests enforce that discipline.

### 3. Component Tests - UI Behavior

**Purpose:** Verify UI behavior, not structure

**Location:** `src/features/onboarding/components/__tests__/step-navigation.test.tsx`

**What to Test:**

- ✅ Step navigation behavior (cannot proceed without valid input)
- ✅ Field-level behavior (errors appear/disappear)
- ✅ Required field indicators
- ✅ Conditional UI (internship disclaimer)

**Contract:** Testing behavior, not how many divs exist. No snapshots.

### 4. Integration Tests - API Boundaries

**Purpose:** Protect boundaries and async flows

**Location:** `src/features/onboarding/api/__tests__/submission.test.ts`

**What to Test:**

- ✅ Submission flow (loading, success, error states)
- ✅ Validation error response mapping
- ✅ Network error handling
- ✅ Retry logic (does not reset form)
- ✅ File upload integration

**Contract:** Most production failures are here. Protect these boundaries.

### 5. Accessibility Testing

**Purpose:** Prevent invisible regressions

**Location:** `src/features/onboarding/components/__tests__/accessibility.test.tsx`

**What to Test:**

- ✅ Semantic correctness (accessible labels, button roles)
- ✅ Keyboard navigation (tab order, focus management)
- ✅ ARIA attributes (aria-disabled, aria-describedby)

**Contract:** Accessibility testing is correctness testing. Period.

## What NOT to Test

Avoid these traps:

- ❌ Testing internal state variables
- ❌ Snapshot testing entire steps
- ❌ Testing library behavior (e.g., browser validation)
- ❌ Testing CSS layout details
- ❌ Testing implementation details of hooks

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage (for reference, not target)
npm run test:coverage
```

## E2E Testing (Future)

**Purpose:** Protect user trust

**What to Test (Only Critical Flows):**

- ✅ Happy path: Start → Complete all steps → Submit → See confirmation
- ✅ One failure path: Submission fails → User retries → Submission succeeds

**Note:** Do not E2E-test every validation rule. That's waste.

## Test Structure

```
src/
├── features/
│   └── onboarding/
│       ├── __tests__/
│       │   └── schemas.test.ts          # Validation logic
│       ├── components/
│       │   └── __tests__/
│       │       ├── step-navigation.test.tsx
│       │       └── accessibility.test.tsx
│       └── api/
│           └── __tests__/
│               └── submission.test.ts    # Integration tests
└── lib/
    └── store/
        └── __tests__/
            └── application-store.test.ts # Derived state
```

## Key Principles

1. **Contracts over Coverage:** Test behavior contracts, not implementation details
2. **Pure Functions First:** Validation logic should be pure and testable
3. **Behavior, Not Structure:** Component tests verify behavior, not DOM structure
4. **Boundary Protection:** Integration tests protect API boundaries
5. **Accessibility is Correctness:** A11y tests are mandatory, not optional

## When to Delete Tests

If a test breaks during refactor without a behavior change, **delete the test**. The test was testing implementation details, not contracts.
