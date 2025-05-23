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
  number: string;
  type: ObjectType;
  title: string;
  description: string;
  features?: string;
  miscellaneous?: string;
  location: string;
  address: {
    country: string;
    city: string;
    zip: number;
    district: string;
    street: string;
    houseNumber?: string;
  };
  price: number;
  dateAdded: Date;
  status: ObjectStatus;
  images?: Array<Types.ObjectId>;
  apartments?: Types.ObjectId;
  commercial_NonResidentialBuildings?: Types.ObjectId;
  landPlots?: Types.ObjectId;
  residentialHouses?: Types.ObjectId;
  freeWith?: string;
}

const RealEstateObjectsSchema: Schema = new Schema<IRealEstateObjects>({
  type: {
    type: String,
    enum: Object.values(ObjectType),
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
  },
  miscellaneous: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: String },
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
  freeWith: {
    type: String,
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
