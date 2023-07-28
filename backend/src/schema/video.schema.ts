import { object, string, TypeOf } from "zod";

const createVideoSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    link: string({ required_error: "Link is required" }),
  }),
});

const updateVideoSchema = object({
  body: object({
    id: string({ required_error: "Id is required" }),
    name: string().optional(),
    link: string().optional(),
  }),
});

export type CreateVideoInput = TypeOf<typeof createVideoSchema>["body"];
export type UpdateVideoInput = TypeOf<typeof updateVideoSchema>["body"];
