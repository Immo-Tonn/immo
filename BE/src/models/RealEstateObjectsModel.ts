import mongoose, { Schema, Document, Types } from "mongoose";

export enum ObjectType {
  LAND = "Land Plots",
  HOUSE = "Residential Houses",
  APARTMENT = "Apartments",
  COMMERCIAL = "Commercial/Non-Residential Buildings",
}

export enum ObjectStatus {
  ACTIVE = "active",
  SOLD = "sold",
  ARCHIVED = "archived",
  RESERVED = "reserved",
}

export interface IRealEstateObjects extends Document {
  id: Types.ObjectId;
  type: ObjectType;
  description: string;
  location: string;
  additionalInfo: string;
  address: {
    city: string;
    zip: number;
  };
  price: number;
  dateAdded: Date;
  status: ObjectStatus;
  images?: Array<Types.ObjectId>;
  apartments?: Types.ObjectId;
  commercial_NonResidentialBuildings?: Types.ObjectId;
  landPlots?: Types.ObjectId;
  residentialHouses?: Types.ObjectId;
}

const RealEstateObjectsSchema: Schema = new Schema<IRealEstateObjects>({
  type: {
    type: String,
    enum: Object.values(ObjectType),
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    required: true,
  },
  address: {
    city: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  price: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(ObjectStatus),
    default: ObjectStatus.ACTIVE,
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Images",
    },
  ],
  apartments: {
    type: Types.ObjectId,
    ref: "Apartments",
  },
  commercial_NonResidentialBuildings: {
    type: Types.ObjectId,
    ref: "Commercial_NonResidentialBuildings",
  },
  landPlots: {
    type: Types.ObjectId,
    ref: "LandPlots",
  },
  residentialHouses: {
    type: Types.ObjectId,
    ref: "ResidentialHouses",
  },
});

const RealEstateObjectsModel = mongoose.model<IRealEstateObjects>(
  "RealEstateObjects",
  RealEstateObjectsSchema
);
export default RealEstateObjectsModel;
