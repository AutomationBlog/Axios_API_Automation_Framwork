class ApiAssertions {
  static assertStatusCode(response, expectedStatus) {
    if (response.status !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus}, but got ${response.status}`
      );
    }
  }

  static assertResponseTime(response, maxTime) {
    const responseTime = response.headers['x-response-time'] || 
                         response.config.metadata?.responseTime || 0;
    
    if (responseTime > maxTime) {
      throw new Error(
        `Response time ${responseTime}ms exceeded maximum ${maxTime}ms`
      );
    }
  }

  static assertHeader(response, headerName, expectedValue) {
    const actualValue = response.headers[headerName.toLowerCase()];
    
    if (actualValue !== expectedValue) {
      throw new Error(
        `Expected header ${headerName} to be ${expectedValue}, but got ${actualValue}`
      );
    }
  }

  static assertHeaderExists(response, headerName) {
    const headerExists = response.headers.hasOwnProperty(headerName.toLowerCase());
    
    if (!headerExists) {
      throw new Error(`Expected header ${headerName} to exist`);
    }
  }

  static assertJsonResponse(response) {
    const contentType = response.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        `Expected JSON response, but got content-type: ${contentType}`
      );
    }
  }

  static assertPropertyExists(data, propertyPath) {
    const properties = propertyPath.split('.');
    let current = data;

    for (const prop of properties) {
      if (!current || !current.hasOwnProperty(prop)) {
        throw new Error(`Property ${propertyPath} does not exist in response`);
      }
      current = current[prop];
    }
  }

  static assertPropertyValue(data, propertyPath, expectedValue) {
    const properties = propertyPath.split('.');
    let current = data;

    for (const prop of properties) {
      if (!current || !current.hasOwnProperty(prop)) {
        throw new Error(`Property ${propertyPath} does not exist in response`);
      }
      current = current[prop];
    }

    if (current !== expectedValue) {
      throw new Error(
        `Expected ${propertyPath} to be ${expectedValue}, but got ${current}`
      );
    }
  }

  static assertArrayLength(array, expectedLength) {
    if (!Array.isArray(array)) {
      throw new Error('Expected an array');
    }

    if (array.length !== expectedLength) {
      throw new Error(
        `Expected array length ${expectedLength}, but got ${array.length}`
      );
    }
  }

  static assertArrayNotEmpty(array) {
    if (!Array.isArray(array)) {
      throw new Error('Expected an array');
    }

    if (array.length === 0) {
      throw new Error('Expected array to not be empty');
    }
  }
}

module.exports = ApiAssertions;
