import config from "config";
import request from "supertest";
import UserModel from "../models/user.model";
import app from "../app";

const mockUser = {
  name: "test",
  password: "123456789",
  passwordConfirm: "123456789",
};

describe("POST /register", () => {
  test("It should successfully register user", async () => {
    const result = await request(app.server)
      .post("/api/auth/register")
      .send(mockUser);
    const user = result.body.data.user;
    expect(user.name).toEqual(mockUser.name);
  });

  test("It should failed register user", async () => {
    const result = await request(app.server)
      .post("/api/auth/register")
      .send({ name: mockUser.name, password: mockUser.password });
    expect(result.body.error[0].message).toEqual(
      "Please confirm your password"
    );
  });

  afterEach(async () => {
    await UserModel.deleteOne({ name: mockUser.name });
  });
});
