class TestDataFactory {
  static generateUser(overrides = {}) {
    return {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      address: {
        street: 'Test Street',
        suite: 'Apt. 1',
        city: 'Test City',
        zipcode: '12345',
        geo: {
          lat: '0.0',
          lng: '0.0'
        }
      },
      phone: '1-234-567-8900',
      website: 'test.com',
      company: {
        name: 'Test Company',
        catchPhrase: 'Testing made easy',
        bs: 'test business'
      },
      ...overrides
    };
  }

  static generatePost(overrides = {}) {
    return {
      title: 'Test Post Title',
      body: 'This is a test post body',
      userId: 1,
      ...overrides
    };
  }

  static generateComment(overrides = {}) {
    return {
      name: 'Test Comment',
      email: 'comment@example.com',
      body: 'This is a test comment',
      postId: 1,
      ...overrides
    };
  }

  static generateInvalidEmail() {
    return 'invalid-email';
  }

  static generateRandomString(length = 10) {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = TestDataFactory;
