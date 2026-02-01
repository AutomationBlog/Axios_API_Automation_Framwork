require('dotenv').config();

// Global test timeout
jest.setTimeout(30000);

// Add custom matchers
expect.extend({
  toHaveStatusCode(response, expectedStatus) {
    const pass = response.status === expectedStatus;
    return {
      pass,
      message: () =>
        pass
          ? `Expected status code not to be ${expectedStatus}`
          : `Expected status code ${expectedStatus}, but got ${response.status}`
    };
  },

  toBeValidJson(response) {
    const contentType = response.headers['content-type'];
    const pass = contentType && contentType.includes('application/json');
    return {
      pass,
      message: () =>
        pass
          ? 'Expected response not to be JSON'
          : `Expected JSON response, but got content-type: ${contentType}`
    };
  },

  toHaveProperty(obj, propertyPath) {
    const properties = propertyPath.split('.');
    let current = obj;
    let pass = true;

    for (const prop of properties) {
      if (!current || !current.hasOwnProperty(prop)) {
        pass = false;
        break;
      }
      current = current[prop];
    }

    return {
      pass,
      message: () =>
        pass
          ? `Expected object not to have property ${propertyPath}`
          : `Expected object to have property ${propertyPath}`
    };
  }
});

// Global setup
beforeAll(() => {
  console.log('Starting E2E API Tests...');
  console.log(`Environment: ${process.env.TEST_ENV || 'default'}`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
});

// Global teardown
afterAll(() => {
  console.log('E2E API Tests completed');
});
