const ApiClient = require("../../src/client/apiClient.js");
const {
  SchemaValidator,
  schemas,
} = require("../../src/utils/schemaValidator.js");
const ApiAssertions = require("../../src/utils/assertions.js");
const TestDataFactory = require("../../src/utils/testDataFactory.js");

describe("Users API - E2E Tests", () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  describe("GET /users", () => {
    test("should return all users", async () => {
      const response = await apiClient.get("/users");

      // Status code assertion
      expect(response).toHaveStatusCode(200);

      // Content type assertion
      expect(response).toBeValidJson();

      // Response body assertions
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      ApiAssertions.assertArrayNotEmpty(response.data);
    });

    test("should return users with valid schema", async () => {
      const response = await apiClient.get("/users");

      expect(response).toHaveStatusCode(200);

      // Validate each user against schema
      response.data.forEach((user) => {
        expect(() => {
          SchemaValidator.validateResponse(user, schemas.user);
        }).not.toThrow();
      });
    });

    test("should return correct number of users", async () => {
      const response = await apiClient.get("/users");

      expect(response).toHaveStatusCode(200);
      expect(response.data.length).toBe(10);
    });
  });

  describe("GET /users/:id", () => {
    test("should return a single user by ID", async () => {
      const userId = 1;
      const response = await apiClient.get(`/users/${userId}`);

      expect(response).toHaveStatusCode(200);
      expect(response).toBeValidJson();

      // Validate response schema
      SchemaValidator.validateResponse(response.data, schemas.user);

      // Validate specific user properties
      expect(response.data.id).toBe(userId);
      ApiAssertions.assertPropertyExists(response.data, "name");
      ApiAssertions.assertPropertyExists(response.data, "email");
    });

    test("should return 404 for non-existent user", async () => {
      const userId = 999999;

      try {
        await apiClient.get(`/users/${userId}`);
        fail("Expected request to fail with 404");
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe("POST /users", () => {
    test("should create a new user", async () => {
      const newUser = TestDataFactory.generateUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });

      const response = await apiClient.post("/users", newUser);

      expect(response).toHaveStatusCode(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();

      // Verify user data
      expect(response.data.name).toBe(newUser.name);
      expect(response.data.email).toBe(newUser.email);
    });

    test("should handle validation errors", async () => {
      const invalidUser = {
        name: "",
        email: TestDataFactory.generateInvalidEmail(),
      };

      try {
        await apiClient.post("/users", invalidUser);
        // Note: JSONPlaceholder doesn't actually validate, but this shows the pattern
      } catch (error) {
        // Handle validation error
        expect(error.response).toBeDefined();
      }
    });
  });

  describe("PUT /users/:id", () => {
    test("should update an existing user", async () => {
      const userId = 1;
      const updatedUser = TestDataFactory.generateUser({
        id: userId,
        name: "Updated Name",
        email: "updated@example.com",
      });

      const response = await apiClient.put(`/users/${userId}`, updatedUser);

      expect(response).toHaveStatusCode(200);
      expect(response.data.name).toBe(updatedUser.name);
      expect(response.data.email).toBe(updatedUser.email);
    });
  });

  describe("PATCH /users/:id", () => {
    test("should partially update a user", async () => {
      const userId = 1;
      const partialUpdate = {
        name: "Patched Name",
      };

      const response = await apiClient.patch(`/users/${userId}`, partialUpdate);

      expect(response).toHaveStatusCode(200);
      expect(response.data.name).toBe(partialUpdate.name);
    });
  });

  describe("DELETE /users/:id", () => {
    test("should delete a user", async () => {
      const userId = 1;

      const response = await apiClient.delete(`/users/${userId}`);

      expect(response).toHaveStatusCode(200);
    });
  });
});
