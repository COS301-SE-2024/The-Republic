import request from "supertest";
import express from "express";
import supabase from "../../services/supabaseClient";
import { serverMiddleare, verifyAndGetUser } from "../../middleware/middleware";
import { sendResponse } from "../../utils/response";

jest.mock("../../services/supabaseClient");
jest.mock("../../utils/response");

const app = express();
app.use(express.json());
app.use(serverMiddleare);

app.get("/test", verifyAndGetUser, (req, res) => {
  res.status(200).json({ message: "success", user_id: req.body.user_id });
});

describe("Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("should call next() if no authorization header", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.user_id).toBeUndefined();
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("should call next() if service role key is provided", async () => {
    const response = await request(app)
      .get("/test")
      .set("x-service-role-key", "test-service-role-key");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("should call next() if token is valid", async () => {
    const mockUser = { id: "123" };
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(app)
      .get("/test")
      .set("Authorization", "Bearer validtoken");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.user_id).toBe("123");
    expect(supabase.auth.getUser).toHaveBeenCalledWith("validtoken");
  });

  it("should send 403 error response if token is invalid", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: new Error("Invalid token"),
    });

    (sendResponse as jest.Mock).mockImplementation((res, data) => {
      res.status(data.code).json(data);
    });

    const response = await request(app)
      .get("/test")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid token");
    expect(supabase.auth.getUser).toHaveBeenCalledWith("invalidtoken");
  });

  it("should send 500 error response if an unexpected error occurs", async () => {
    (supabase.auth.getUser as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    (sendResponse as jest.Mock).mockImplementation((res, data) => {
      res.status(data.code).json(data);
    });

    const response = await request(app)
      .get("/test")
      .set("Authorization", "Bearer validtoken");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("An unexpected error occurred. Please try again later.");
    expect(supabase.auth.getUser).toHaveBeenCalledWith("validtoken");
  });
});