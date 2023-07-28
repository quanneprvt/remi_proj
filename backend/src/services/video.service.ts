import VideoModel, { Video } from "../models/video.model";
import { findAndUpdateUser, findUser, findUserById } from "./user.service";
import { User } from "../models/user.model";

export const mapVideoModelToVideo = async (
  video: DocumentType & { _doc?: Video }
) => {
  const createdBy = await findUserById(video._doc?.createdBy as string);
  return {
    ...video._doc,
    createdBy: {
      name: createdBy.name,
      id: createdBy._id,
    },
  };
};

// Find All items
export const findVideosByUser = async (userId: string) => {
  const videos = await VideoModel.find({ createdBy: userId });
  return Promise.all(
    videos.map((item) => mapVideoModelToVideo(item as unknown as DocumentType))
  );
};

// Find All open videos
export const findAllVideos = async () => {
  const items = await VideoModel.find().sort({
    updateAt: -1,
  });
  return Promise.all(
    items.map((item) => mapVideoModelToVideo(item as unknown as DocumentType))
  );
};

// Create Video
export const createVideo = async (input: Partial<Video>) => {
  const video = await VideoModel.create(input);
  return mapVideoModelToVideo(video as unknown as DocumentType);
};

// findItem
export const findVideoById = async (id: string) => {
  const video = await VideoModel.findById(id);
  return mapVideoModelToVideo(video as unknown as DocumentType);
};

// Update Item
export const updateVideo = async (item: Partial<Video>) => {
  const video = await VideoModel.findOneAndUpdate(
    { _id: item.id },
    { ...item }
  );
  return mapVideoModelToVideo(video as unknown as DocumentType);
};
