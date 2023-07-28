import {
  findAllVideos,
  findVideoById,
  findVideosByUser,
  updateVideo,
} from "../services/video.service";
import { CreateVideoInput, UpdateVideoInput } from "../schema/video.schema";
import { Status } from "../interfaces";
import { Request, NextFunction } from "express";
import { Response } from "../interfaces";
import { createVideo } from "../services/video.service";
import global from "../app";

export const getMyVideosHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const videos = await findVideosByUser(user._id);
    res.status(201).json({
      status: Status.SUCCESS,
      data: {
        videos,
      },
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const getAllVideosHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const videos = await findAllVideos();

    res.status(201).json({
      status: Status.SUCCESS,
      data: {
        videos,
      },
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const createVideoHandler = async (
  req: Request<{}, {}, CreateVideoInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const video = await createVideo({
      name: req.body.name,
      createdBy: res.locals.user._id,
      link: req.body.link,
    });

    global.socket.sockets.emit(
      "VIDEO_SHARED",
      JSON.stringify({
        video,
      })
    );

    res.status(201).json({
      status: Status.SUCCESS,
      data: {
        video: {
          ...video,
        },
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateVideoHandler = async (
  req: Request<{}, {}, UpdateVideoInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const preConditionVideo = await findVideoById(req.body.id);
    if (res.locals.user._id !== preConditionVideo.createdBy.id) {
      next({
        status: 401,
        statusCode: "Unauthorize",
      });
      return;
    }
    const video = await updateVideo(req.body);
    res.status(200).json({
      status: Status.SUCCESS,
      data: {
        video,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
