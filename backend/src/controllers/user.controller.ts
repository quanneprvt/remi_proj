import { Status } from "./../interfaces";
import { Request, NextFunction } from "express";
import { Response } from "../interfaces";
import { findAllUsers } from "../services/user.service";

export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: Status.SUCCESS,
      data: {
        user: {
          ...user,
          id: user._id,
        },
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({
      status: Status.SUCCESS,
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
