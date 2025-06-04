import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVideo extends Document {
  id: Types.ObjectId;
  videoId: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  realEstateObject: Types.ObjectId;
  dateAdded: Date;
}

const VideoSchema: Schema<IVideo> = new Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  realEstateObject: {
    type: Schema.Types.ObjectId,
    ref: "RealEstateObjects",
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const VideoModel = mongoose.model<IVideo>("Videos", VideoSchema);
export default VideoModel;
