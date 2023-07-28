import { number, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    password: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({ required_error: "Please confirm your password" }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    password: string({ required_error: "Password is required" }).min(
      0,
      "Invalid name or password"
    ),
  }),
});

export const refreshTokenSchema = object({
  body: object({
    token: string({ required_error: "Token is required" }),
  }),
});

export const depositMoneySchema = object({
  body: object({
    money: number({ required_error: "Money is required" }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
export type refreshTokenInput = TypeOf<typeof refreshTokenSchema>["body"];
