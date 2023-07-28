import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

@index({ name: 1 })
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the Item class to be used as TypeScript type
export class Video {
  @prop()
  id: string;

  @prop()
  name: string;

  @prop()
  link: string;

  @prop()
  subscriber: string[];

  @prop()
  createdBy: string;
}

// Create the item model from the Item class
const VideoModel = getModelForClass(Video);

export default VideoModel;
