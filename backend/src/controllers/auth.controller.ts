import { refreshTokenInput } from "./../schema/user.schema";
import config from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { Status } from "../interfaces";
import { CreateUserInput, LoginUserInput } from "../schema/user.schema";
import {
  createUser,
  findUser,
  getAccessToken,
  getRefreshToken,
  findUserByToken,
} from "../services/user.service";
import AppError from "../utils/appError";
import { verifyJwt } from "../utils/jwt";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser({
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: Status.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: Status.FAIL,
        message: "Name already exist",
      });
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ name: req.body.name });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError("Invalid name or password", 401));
    }
    const [access_token, refresh_token] = await Promise.all([
      await getAccessToken(user),
      await getRefreshToken(user),
    ]);
    // Send Access Token in Cookie
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: Status.SUCCESS,
      access_token,
      refresh_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshTokenHandler = async (
  req: Request<{}, {}, refreshTokenInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token: refreshToken } = req.body;
    if (
      verifyJwt(
        refreshToken,
        Buffer.from(
          config.get<string>("refreshTokenPublicKey"),
          "base64"
        ).toString("ascii")
      )
    ) {
      const user = await findUserByToken(refreshToken);
      if (user) {
        const access_token = await getAccessToken(user);
        // Send Access Token
        res.status(200).json({
          status: Status.SUCCESS,
          access_token,
        });
      } else {
        return next(new AppError(`No user found`, 401));
      }
    } else {
      return next(new AppError(`Invalid token or session has expired`, 401));
    }
  } catch (err: any) {
    next(err);
  }
};
