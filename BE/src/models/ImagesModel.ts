import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ImageType {
  MAIN = 'main',
  PLAN = 'plan',
  ADDITIONAL = 'additional',
}

export interface IImage extends Document {
  id: Types.ObjectId;
  realEstateObject: Types.ObjectId;
  url: string;
  type: ImageType;
}

const ImagesSchema: Schema<IImage> = new Schema({
  realEstateObject: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstateObjects',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(ImageType),
    required: true,
  },
});

const ImagesModel = mongoose.model<IImage>('Images', ImagesSchema);
export default ImagesModel;
