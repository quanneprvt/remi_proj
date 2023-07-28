import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from "config";
import UserModel, { User } from "../models/user.model";
import { excludedFields } from "../controllers/auth.controller";
import { signJwt, verifyJwt } from "../utils/jwt";
import { DocumentType } from "@typegoose/typegoose";

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  const user = await UserModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Update User
export const updateUser = async (user: DocumentType<User>) => {
  await UserModel.findOneAndUpdate({ _id: user._id }, { ...user });
  return user;
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await UserModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await UserModel.find();
};

// Find All users
export const findAndUpdateUser = async (
  query: FilterQuery<User>,
  user: User
) => {
  return await UserModel.findOneAndUpdate(query, user);
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await UserModel.findOne(query, {}, options).select("+password");
};

// Sign Token
export const signToken = (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = signJwt(
    { sub: user._id },
    Buffer.from(config.get<string>("accessTokenPrivateKey"), "base64").toString(
      "ascii"
    ),
    {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    }
  );

  // Return access token
  return { access_token };
};

// Sign Token
export const signRefreshToken = (user: DocumentType<User>) => {
  // Sign the access token
  const refresh_token = signJwt(
    { sub: user._id },
    Buffer.from(
      config.get<string>("refreshTokenPrivateKey"),
      "base64"
    ).toString("ascii"),
    {
      expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
    }
  );

  // Return access token
  return { refresh_token };
};

export const getAccessToken = async (user: DocumentType<User>) => {
  if (
    user.accessToken &&
    verifyJwt(
      user.accessToken,
      Buffer.from(
        config.get<string>("accessTokenPublicKey"),
        "base64"
      ).toString("ascii")
    )
  )
    return user.accessToken;
  else {
    const token = signToken(user).access_token;
    await UserModel.findByIdAndUpdate(user._id, { accessToken: token });
    return token;
  }
};

export const getRefreshToken = async (user: DocumentType<User>) => {
  if (
    user.refreshToken &&
    verifyJwt(
      user.refreshToken,
      Buffer.from(
        config.get<string>("refreshTokenPublicKey"),
        "base64"
      ).toString("ascii")
    )
  )
    return user.refreshToken;
  else {
    const token = signRefreshToken(user).refresh_token;
    await UserModel.findByIdAndUpdate(user._id, { refreshToken: token });
    return token;
  }
};

export const findUserByToken = async (refreshToken: string) => {
  return await UserModel.findOne({ refreshToken });
};
