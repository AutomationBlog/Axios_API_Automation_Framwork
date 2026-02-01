# API E2E Testing Framework with Axios

A comprehensive end-to-end API testing framework built with Axios, Jest, and Joi for schema validation.

## Features

- ✅ **Axios HTTP Client** - Robust API client with interceptors
- ✅ **Jest Testing Framework** - Popular testing framework with excellent features
- ✅ **Joi Schema Validation** - Validate API responses against schemas
- ✅ **Custom Assertions** - Helper functions for common API assertions
- ✅ **Test Data Factory** - Generate test data easily
- ✅ **Environment Configuration** - Support for multiple environments
- ✅ **Request/Response Logging** - Built-in logging with interceptors
- ✅ **Authentication Support** - Token-based authentication handling
- ✅ **Custom Matchers** - Extended Jest matchers for API testing
- ✅ **HTML Test Reports** - Interactive, visual test reports with search and filtering
- ✅ **Multiple Report Formats** - Standard, detailed, and enhanced custom reports
- ✅ **Export Functionality** - Export test results as JSON

## Project Structure

```bash
api-e2e-testing-framework/
├── reports/
|   ├── test-report.html           # Main HTML report (jest-html-reporter)
|   ├── html-report/
|   │   └── detailed-report.html   # Detailed report (jest-html-reporters)
|   ├── enhanced-report.html       # Custom enhanced report
|   ├── custom-report-style.css    # Custom styling
|   └── custom-report-script.js    # Interactive features
├── src/
│   ├── client/
│   │   └── apiClient.js          # Axios client configuration
│   └── utils/
│       ├── assertions.js          # Custom assertion helpers
│       ├── generateReport.js      # Custom report generator
│       ├── schemaValidator.js     # Joi schema validators
│       └── testDataFactory.js     # Test data generators
├── tests/
│   ├── e2e/
│   │   ├── users.test.js         # Users endpoint tests
│   │   └── posts.test.js         # Posts endpoint tests
│   └── setup.js                   # Jest setup and custom matchers
├── .env.example                   # Environment variables template
├── jest.config.js                 # Jest configuration
└── package.json                   # Project dependencies
```

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2.Create a `.env` file from the example:

```bash
cp .env.example .env
```

3.Update the `.env` file with your API configuration:

```env
BASE_URL=https://jsonplaceholder.typicode.com
API_TIMEOUT=10000
AUTH_TOKEN=your_token_here
TEST_ENV=staging
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test suites

```bash
npm run test:smoke
npm run test:regression
```

### Generate HTML reports

```bash
npm run test:report
```

### Open HTML report in browser

```bash
npm run report:open
```

## HTML Test Reports

The framework generates beautiful, interactive HTML reports with:

- 📊 **Visual Dashboard** - Summary statistics and pass rate
- 🔍 **Search & Filter** - Find specific tests quickly
- 📁 **Collapsible Suites** - Organized test results
- 📈 **Charts & Graphs** - Visual representation of results
- 💾 **Export to JSON** - Download test data
- 🎨 **Dark Mode** - Automatic theme detection
- ⌨️ **Keyboard Shortcuts** - Fast navigation

**Report Locations:**

- Main report: `reports/test-report.html`
- Detailed report: `reports/html-report/detailed-report.html`
- Enhanced report: `reports/enhanced-report.html`

For detailed information, see [HTML Reports Guide](docs/HTML_REPORTS.md)

## Usage Examples

### Basic API Call

```javascript
const ApiClient = require('./src/client/apiClient');

const apiClient = new ApiClient();

// GET request
const response = await apiClient.get('/users');

// POST request
const newUser = { name: 'John', email: 'john@example.com' };
const response = await apiClient.post('/users', newUser);

// PUT request
const response = await apiClient.put('/users/1', updatedUser);

// DELETE request
const response = await apiClient.delete('/users/1');
```

### Schema Validation

```javascript
const { SchemaValidator, schemas } = require('./src/utils/schemaValidator');

const response = await apiClient.get('/users/1');

// Validate response against schema
SchemaValidator.validateResponse(response.data, schemas.user);
```

### Custom Assertions

```javascript
const ApiAssertions = require('./src/utils/assertions');

const response = await apiClient.get('/users');

// Assert status code
ApiAssertions.assertStatusCode(response, 200);

// Assert header exists
ApiAssertions.assertHeaderExists(response, 'content-type');

// Assert property exists
ApiAssertions.assertPropertyExists(response.data, 'id');

// Assert array not empty
ApiAssertions.assertArrayNotEmpty(response.data);
```

### Using Test Data Factory

```javascript
const TestDataFactory = require('./src/utils/testDataFactory');

// Generate a user
const user = TestDataFactory.generateUser({
  name: 'Custom Name',
  email: 'custom@example.com'
});

// Generate a post
const post = TestDataFactory.generatePost({
  title: 'My Post Title'
});

// Generate random data
const randomString = TestDataFactory.generateRandomString(15);
const randomNumber = TestDataFactory.generateRandomNumber(1, 100);
```

### Writing Tests

```javascript
const ApiClient = require('../../src/client/apiClient');
const { SchemaValidator, schemas } = require('../../src/utils/schemaValidator');

describe('API Endpoint Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  test('should return users', async () => {
    const response = await apiClient.get('/users');

    // Using custom matchers
    expect(response).toHaveStatusCode(200);
    expect(response).toBeValidJson();

    // Schema validation
    response.data.forEach(user => {
      SchemaValidator.validateResponse(user, schemas.user);
    });
  });

  test('should handle errors gracefully', async () => {
    try {
      await apiClient.get('/invalid-endpoint');
      fail('Expected request to fail');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
```

## Custom Jest Matchers

The framework includes custom Jest matchers:

- `toHaveStatusCode(expectedStatus)` - Assert HTTP status code
- `toBeValidJson()` - Assert response is valid JSON
- `toHaveProperty(propertyPath)` - Assert object has nested property

Example:

```javascript
expect(response).toHaveStatusCode(200);
expect(response).toBeValidJson();
expect(response.data).toHaveProperty('user.address.city');
```

## Authentication

Set authentication token in two ways:

### Via Environment Variables

```env
AUTH_TOKEN=your_token_here
```

### Programmatically

```javascript
const apiClient = new ApiClient();
apiClient.setAuthToken('your_token_here');

// Remove token
apiClient.removeAuthToken();
```

## Best Practices

1. **Organize tests by endpoint** - Group related tests together
2. **Use descriptive test names** - Make test purpose clear
3. **Validate schemas** - Always validate response structure
4. **Handle errors** - Test both success and failure scenarios
5. **Use test data factory** - Generate consistent test data
6. **Clean up after tests** - Delete created resources if needed
7. **Use setup/teardown** - Initialize common test data
8. **Keep tests independent** - Tests should not depend on each other

## Adding New Schemas

To add a new schema for validation:

```javascript
// In src/utils/schemaValidator.js
const schemas = {
  // ... existing schemas
  
  newResource: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    // Add more fields
  })
};
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| BASE_URL | API base URL | https://jsonplaceholder.typicode.com |
| API_TIMEOUT | Request timeout in ms | 10000 |
| AUTH_TOKEN | Authentication token | - |
| TEST_ENV | Test environment | staging |
| LOG_LEVEL | Logging level | info |

## Troubleshooting

### Tests timing out

Increase the timeout in `jest.config.js`:

```javascript
testTimeout: 60000
```

### Network errors

Check your `.env` file has the correct `BASE_URL`

### Schema validation failing

Review the schema definition and ensure it matches the API response structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

ISC
