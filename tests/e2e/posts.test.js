const ApiClient = require("../../src/client/apiClient.js");
const {
  SchemaValidator,
  schemas,
} = require("../../src/utils/schemaValidator.js");
const ApiAssertions = require("../../src/utils/assertions.js");
const TestDataFactory = require("../../src/utils/testDataFactory.js");

describe("Posts API - E2E Tests", () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new ApiClient();
  });

  describe("GET /posts", () => {
    test("should return all posts", async () => {
      const response = await apiClient.get("/posts");

      expect(response).toHaveStatusCode(200);
      expect(response).toBeValidJson();
      expect(Array.isArray(response.data)).toBe(true);
      ApiAssertions.assertArrayNotEmpty(response.data);
    });

    test("should filter posts by userId", async () => {
      const userId = 1;
      const response = await apiClient.get("/posts", {
        params: { userId },
      });

      expect(response).toHaveStatusCode(200);

      // Verify all posts belong to the specified user
      response.data.forEach((post) => {
        expect(post.userId).toBe(userId);
      });
    });

    test("should validate posts schema", async () => {
      const response = await apiClient.get("/posts");

      expect(response).toHaveStatusCode(200);

      // Validate first post
      if (response.data.length > 0) {
        SchemaValidator.validateResponse(response.data[0], schemas.post);
      }
    });
  });

  describe("GET /posts/:id", () => {
    test("should return a single post", async () => {
      const postId = 1;
      const response = await apiClient.get(`/posts/${postId}`);

      expect(response).toHaveStatusCode(200);
      SchemaValidator.validateResponse(response.data, schemas.post);
      expect(response.data.id).toBe(postId);
    });

    test("should return 404 for non-existent post", async () => {
      try {
        await apiClient.get("/posts/999999");
        fail("Expected 404 error");
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe("POST /posts", () => {
    test("should create a new post", async () => {
      const newPost = TestDataFactory.generatePost({
        title: "Test Post",
        body: "This is a test post content",
      });

      const response = await apiClient.post("/posts", newPost);

      expect(response).toHaveStatusCode(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
    });
  });

  describe("GET /posts/:id/comments", () => {
    test("should return comments for a post", async () => {
      const postId = 1;
      const response = await apiClient.get(`/posts/${postId}/comments`);

      expect(response).toHaveStatusCode(200);
      expect(Array.isArray(response.data)).toBe(true);

      // Verify all comments belong to the post
      response.data.forEach((comment) => {
        expect(comment.postId).toBe(postId);
        SchemaValidator.validateResponse(comment, schemas.comment);
      });
    });
  });

  describe("Complex scenarios", () => {
    test("should handle post creation and retrieval workflow", async () => {
      // Step 1: Create a post
      const newPost = TestDataFactory.generatePost({
        userId: 1,
        title: "Workflow Test Post",
      });

      const createResponse = await apiClient.post("/posts", newPost);
      expect(createResponse).toHaveStatusCode(201);

      const createdPostId = createResponse.data.id;

      // Step 2: Retrieve the created post
      const getResponse = await apiClient.get(`/posts/${createdPostId}`);
      expect(getResponse).toHaveStatusCode(200);
      expect(getResponse.data.title).toBe(newPost.title);
    });

    test("should handle pagination", async () => {
      const response = await apiClient.get("/posts", {
        params: {
          _start: 0,
          _limit: 10,
        },
      });

      expect(response).toHaveStatusCode(200);
      expect(response.data.length).toBeLessThanOrEqual(10);
    });
  });
});
