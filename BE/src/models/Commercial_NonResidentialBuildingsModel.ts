import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommercial_NonResidentialBuildings extends Document {
  id: Types.ObjectId;
  realEstateObject: Types.ObjectId;
  buildingType: string;
  area?: number;
  yearBuilt?: number;
  purpose?: string;
  additionalFeatures?: string;
}

const Commercial_NonResidentialBuildingsSchema: Schema =
  new Schema<ICommercial_NonResidentialBuildings>({
    realEstateObject: {
      type: Schema.Types.ObjectId,
      ref: 'RealEstateObjects',
      required: true,
    },
    buildingType: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
    },
    yearBuilt: {
      type: Number,
    },
    purpose: {
      type: String,
    },
    additionalFeatures: {
      type: String,
    },
  });

const Commercial_NonResidentialBuildingsModel =
  mongoose.model<ICommercial_NonResidentialBuildings>(
    'Commercial_NonResidentialBuildings',
    Commercial_NonResidentialBuildingsSchema,
  );
export default Commercial_NonResidentialBuildingsModel;
