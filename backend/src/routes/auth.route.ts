import express from "express";
import {
  loginHandler,
  registerHandler,
  refreshTokenHandler,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  loginUserSchema,
  refreshTokenSchema,
} from "../schema/user.schema";

const router = express.Router();

// Register user route
router.post("/register", validate(createUserSchema), registerHandler);

// Login user route
router.post("/login", validate(loginUserSchema), loginHandler);

// Refresh user token
router.post("/token", validate(refreshTokenSchema), refreshTokenHandler);

export default router;
