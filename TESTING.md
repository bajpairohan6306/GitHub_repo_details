# Testing Guide for GitHub Contributors Finder

## Overview
This document provides a comprehensive guide to testing the GitHub Contributors Finder React application using Vitest and React Testing Library.

## Setup

### Installation
Testing dependencies have been installed:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration
The Vite configuration (`vite.config.js`) has been updated to include Vitest settings:
```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
}
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm test:ui
```

### Run tests with coverage report
```bash
npm test:coverage
```

### Run specific test file
```bash
npm test src/test/Home.test.jsx
```

## Test Files

### 1. Home.test.jsx
Tests for the main repository search page component.

**Test Cases:**
- `renders the header with correct title` - Verifies app title is displayed
- `renders input fields for owner and repo` - Checks input fields exist
- `renders search button` - Verifies search button is present
- `shows error message when inputs are empty` - Tests form validation
- `disables inputs and button while loading` - Tests loading state
- `displays error message on API failure` - Tests error handling
- `fetches and displays contributors on successful search` - Tests data fetching
- `sorts contributors by name` - Tests sorting functionality
- `displays empty state when no search performed` - Tests initial state
- `shows pagination controls when there are many contributors` - Tests pagination
- `trims whitespace from inputs before fetching` - Tests input sanitization

**What's tested:**
- Component rendering
- Form input handling
- API calls and responses
- Error states
- Loading states
- Sorting functionality
- Empty states
- Pagination display
- Input validation and trimming

### 2. UserContributions.test.jsx
Tests for the user profile and repositories page component.

**Test Cases:**
- `renders loading state initially` - Tests initial loading state
- `renders back button` - Verifies back button is present
- `displays user profile information` - Tests user data display
- `displays user statistics` - Tests stats display (repos, followers, following)
- `displays user repositories` - Tests repository list display
- `displays error message on API failure` - Tests error handling
- `displays language badges for repositories` - Tests language labels
- `handles repositories with null language` - Tests edge case handling

**What's tested:**
- Loading states
- User information display
- User statistics
- Repository listing
- Error handling
- Language badges
- Edge cases (null values)

## Testing Best Practices Used

### 1. Component Testing
- Tests focus on user behavior and UI interactions
- Uses `screen` queries to find elements (preferred over `getByTestId`)
- Tests actual user workflows

### 2. Mocking
- Global `fetch` is mocked to avoid real API calls
- Mock data matches real GitHub API response structure
- Tests can run offline without external dependencies

### 3. Async Testing
- Uses `waitFor` for async operations
- Properly handles promise-based API calls
- Tests wait for state updates

### 4. Isolation
- Each test is independent and doesn't affect others
- `beforeEach` clears mocks between tests
- Uses `MemoryRouter` for routing tests

### 5. Descriptive Names
- Test names clearly describe what's being tested
- Easy to understand test purpose at a glance

## Common Test Patterns

### Testing Component Rendering
```javascript
it('renders the header with correct title', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  )
  
  const title = screen.getByText(/GitHub Contributors Finder/i)
  expect(title).toBeInTheDocument()
})
```

### Testing User Interactions
```javascript
fireEvent.change(input, { target: { value: 'facebook' } })
fireEvent.click(button)
```

### Testing Async Operations
```javascript
await waitFor(() => {
  expect(screen.getByText('user1')).toBeInTheDocument()
})
```

### Testing API Calls
```javascript
fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockData,
})
```

## Mock Data Structure

### Contributor Mock
```javascript
{
  id: 1,
  login: 'username',
  avatar_url: 'https://example.com/avatar.jpg',
  contributions: 100,
  html_url: 'https://github.com/username'
}
```

### Repository Mock
```javascript
{
  name: 'repo-name',
  stargazers_count: 1000,
  forks_count: 500,
  watchers_count: 200,
  description: 'Repository description'
}
```

### User Mock
```javascript
{
  login: 'username',
  name: 'Full Name',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'User bio',
  html_url: 'https://github.com/username',
  public_repos: 10,
  followers: 100,
  following: 50
}
```

## Assertions Used

Common assertions in the test suite:
```javascript
expect(element).toBeInTheDocument()
expect(element).toBeDisabled()
expect(element).toHaveTextContent('text')
expect(fetch).toHaveBeenCalledWith(...)
expect(input).toBeDisabled()
```

## Tips for Adding New Tests

1. **Test user behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state directly

2. **Use semantic queries**
   ```javascript
   // Good
   screen.getByRole('button', { name: /Search/i })
   screen.getByLabelText('Repository Owner')
   
   // Avoid
   screen.getByTestId('search-btn')
   ```

3. **Mock external dependencies**
   - Mock API calls
   - Mock routing if needed
   - Keep tests isolated

4. **Test edge cases**
   - Empty data
   - Null/undefined values
   - Error states
   - Loading states

5. **Keep tests focused**
   - One assertion per test (ideally)
   - Test one thing at a time
   - Use descriptive test names

## Debugging Tests

### Print DOM
```javascript
screen.debug() // Prints the entire DOM
screen.debug(element) // Prints specific element
```

### Inspect Elements
```javascript
const element = screen.getByText('text')
console.log(element)
```

### Check all text content
```javascript
screen.getByText((content, element) => {
  console.log(content)
  return true
})
```

## Known Issues & Solutions

### Issue: Tests failing with "Unable to find element"
**Solution:** Make sure the mocked API returns the expected data structure and wait for the async operation to complete with `waitFor`.

### Issue: State not updating in tests
**Solution:** Use `waitFor` to wait for state updates, not just immediate assertions.

### Issue: Multiple instances of provider
**Solution:** Wrap components in `BrowserRouter` or `MemoryRouter` as needed.

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test -- --run

- name: Generate coverage
  run: npm test:coverage
```

## Coverage Goals

Aim for:
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

Current coverage can be checked with:
```bash
npm test:coverage
```

## Further Reading

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing to Tests

When adding new features:
1. Write tests first (TDD approach)
2. Make sure tests fail initially
3. Implement the feature
4. Verify tests pass
5. Refactor if needed
6. Commit tests with code

---

**Last Updated:** January 16, 2026
**Test Suite Version:** 1.0
