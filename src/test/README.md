# Testing Guide

This directory contains test utilities and configuration for the News Aggregator application.

## Table of Contents

- [Testing Guide](#testing-guide)
  - [Table of Contents](#table-of-contents)
  - [Structure](#structure)
  - [Running Tests](#running-tests)
  - [Writing Tests](#writing-tests)
    - [Component Tests](#component-tests)
    - [Hook Tests](#hook-tests)
    - [Mock Data](#mock-data)
  - [Best Practices](#best-practices)

## Structure

```
src/
├── test/
│   ├── setup.ts           # Test environment setup
│   ├── test-utils.tsx     # Custom render functions and utilities
│   ├── mock-data.ts       # Mock data factories
│   └── README.md          # This file
├── __tests__/             # App-level tests
├── components/__tests__/  # Component tests
├── hooks/__tests__/       # Hook tests
├── lib/__tests__/         # Utility function tests
└── services/__tests__/    # Service/API tests
```

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Writing Tests

### Component Tests

Use the custom `render` function from `test-utils.tsx` which automatically wraps components with necessary providers:

```typescript
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';

it('handles user interaction', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### Hook Tests

Use `renderHook` with the wrapper from `test-utils.tsx`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { AllTheProviders } from '@/test/test-utils';

it('fetches data', async () => {
  const { result } = renderHook(() => useMyHook(), {
    wrapper: AllTheProviders,
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

### Mock Data

Use factory functions from `mock-data.ts` to create test data:

```typescript
import { createMockArticle, createMockArticles } from '@/test/mock-data';

const article = createMockArticle({ title: 'Custom Title' });
const articles = createMockArticles(10);
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does
2. **Use realistic data**: Mock data should resemble real API responses
3. **Avoid over-mocking**: Only mock external dependencies (APIs, etc.)
4. **Write clear test descriptions**: Use descriptive test names
5. **Keep tests isolated**: Each test should be independent
6. **Test edge cases**: Empty states, errors, loading states
7. **Use user-event over fireEvent**: More realistic user interactions
