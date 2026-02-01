const ApiClient = require("../../src/client/apiClient.js");
const {
  SchemaValidator,
  schemas,
} = require("../../src/utils/schemaValidator.js");
const TestDataFactory = require("../../src/utils/testDataFactory.js");

describe("Integration Tests - Complex Workflows", () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  describe("User and Posts Workflow", () => {
    test("should create user, create post, and verify relationship", async () => {
      // Step 1: Create a new user
      const newUser = TestDataFactory.generateUser({
        name: "Integration Test User",
        email: "integration@test.com",
      });

      const userResponse = await apiClient.post("/users", newUser);
      expect(userResponse).toHaveStatusCode(201);

      const userId = userResponse.data.id;
      expect(userId).toBeDefined();

      // Step 2: Create a post for this user
      const newPost = TestDataFactory.generatePost({
        userId: userId,
        title: "Integration Test Post",
        body: "This post was created during integration testing",
      });

      const postResponse = await apiClient.post("/posts", newPost);
      expect(postResponse).toHaveStatusCode(201);
      expect(postResponse.data.userId).toBe(userId);

      // Step 3: Verify we can retrieve the post
      const getPostResponse = await apiClient.get(
        `/posts/${postResponse.data.id}`,
      );
      expect(getPostResponse).toHaveStatusCode(200);
      expect(getPostResponse.data.title).toBe(newPost.title);
    });

    test("should retrieve user posts and validate count", async () => {
      const userId = 1;

      // Get user
      const userResponse = await apiClient.get(`/users/${userId}`);
      expect(userResponse).toHaveStatusCode(200);
      SchemaValidator.validateResponse(userResponse.data, schemas.user);

      // Get user's posts
      const postsResponse = await apiClient.get("/posts", {
        params: { userId },
      });
      expect(postsResponse).toHaveStatusCode(200);
      expect(Array.isArray(postsResponse.data)).toBe(true);

      // Validate each post belongs to the user
      postsResponse.data.forEach((post) => {
        expect(post.userId).toBe(userId);
        SchemaValidator.validateResponse(post, schemas.post);
      });
    });
  });

  describe("Post and Comments Workflow", () => {
    test("should create post, add comments, and retrieve all comments", async () => {
      // Step 1: Create a post
      const newPost = TestDataFactory.generatePost({
        title: "Post with Comments Test",
      });

      const postResponse = await apiClient.post("/posts", newPost);
      expect(postResponse).toHaveStatusCode(201);

      const postId = postResponse.data.id;

      // Step 2: Create multiple comments for the post
      const commentPromises = [];
      for (let i = 0; i < 3; i++) {
        const comment = TestDataFactory.generateComment({
          postId: postId,
          name: `Test Comment ${i + 1}`,
          email: `commenter${i + 1}@test.com`,
        });
        commentPromises.push(apiClient.post("/comments", comment));
      }

      const commentResponses = await Promise.all(commentPromises);
      commentResponses.forEach((response) => {
        expect(response).toHaveStatusCode(201);
      });

      // Step 3: Retrieve all comments for the post
      const getCommentsResponse = await apiClient.get(
        `/posts/${postId}/comments`,
      );
      expect(getCommentsResponse).toHaveStatusCode(200);

      // Note: JSONPlaceholder may not persist our comments,
      // but this demonstrates the workflow
    });
  });

  describe("CRUD Operations Workflow", () => {
    let createdUserId;

    test("should complete full CRUD lifecycle", async () => {
      // CREATE
      const createData = TestDataFactory.generateUser({
        name: "CRUD Test User",
      });

      const createResponse = await apiClient.post("/users", createData);
      expect(createResponse).toHaveStatusCode(201);
      createdUserId = createResponse.data.id;

      // READ
      const readResponse = await apiClient.get(`/users/${createdUserId}`);
      expect(readResponse).toHaveStatusCode(200);
      expect(readResponse.data.id).toBe(createdUserId);

      // UPDATE (full)
      const updateData = TestDataFactory.generateUser({
        id: createdUserId,
        name: "Updated CRUD User",
      });

      const updateResponse = await apiClient.put(
        `/users/${createdUserId}`,
        updateData,
      );
      expect(updateResponse).toHaveStatusCode(200);
      expect(updateResponse.data.name).toBe(updateData.name);

      // UPDATE (partial)
      const patchData = { name: "Patched CRUD User" };
      const patchResponse = await apiClient.patch(
        `/users/${createdUserId}`,
        patchData,
      );
      expect(patchResponse).toHaveStatusCode(200);

      // DELETE
      const deleteResponse = await apiClient.delete(`/users/${createdUserId}`);
      expect(deleteResponse).toHaveStatusCode(200);
    });
  });

  describe("Error Handling Scenarios", () => {
    test("should handle 404 errors gracefully", async () => {
      try {
        await apiClient.get("/users/999999");
        fail("Expected 404 error");
      } catch (error) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
      }
    });

    test("should handle network timeouts", async () => {
      const slowClient = new ApiClient();
      slowClient.client.defaults.timeout = 1; // 1ms timeout

      try {
        await slowClient.get("/users");
        fail("Expected timeout error");
      } catch (error) {
        expect(error.code).toBeDefined();
      }
    }, 10000);

    test("should handle invalid endpoints", async () => {
      try {
        await apiClient.get("/invalid-endpoint-xyz");
        fail("Expected error for invalid endpoint");
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe("Concurrent Requests", () => {
    test("should handle multiple parallel requests", async () => {
      const requests = [
        apiClient.get("/users/1"),
        apiClient.get("/users/2"),
        apiClient.get("/posts/1"),
        apiClient.get("/posts/2"),
        apiClient.get("/comments/1"),
      ];

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response).toHaveStatusCode(200);
        expect(response).toBeValidJson();
      });
    });

    test("should handle mixed success and error responses", async () => {
      const requests = [
        apiClient.get("/users/1"),
        apiClient.get("/users/999999").catch((e) => e),
        apiClient.get("/posts/1"),
        apiClient.get("/posts/999999").catch((e) => e),
      ];

      const results = await Promise.all(requests);

      // Check successful requests
      expect(results[0]).toHaveStatusCode(200);
      expect(results[2]).toHaveStatusCode(200);

      // Check failed requests
      expect(results[1].response.status).toBe(404);
      expect(results[3].response.status).toBe(404);
    });
  });
});
