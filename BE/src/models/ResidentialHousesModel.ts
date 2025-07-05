import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResidentialHouses extends Document {
  id: Types.ObjectId;
  realEstateObject: Types.ObjectId;
  type: string;
  numberOfFloors?: number;
  livingArea: number;
  usableArea?: number;
  plotArea?: number;
  numberOfRooms: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  garageParkingSpaces?: string;
  yearBuilt?: number;
  heatingType?: string;
  energySource?: string;
  energyEfficiencyClass?: string;
  additionalFeatures?: string;
}

const ResidentialHousesSchema: Schema = new Schema<IResidentialHouses>({
  realEstateObject: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstateObjects',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  numberOfFloors: {
    type: Number,
  },
  livingArea: {
    type: Number,
    required: true,
  },
  usableArea: {
    type: Number,
  },
  plotArea: {
    type: Number,
  },
  numberOfRooms: {
    type: Number,
  },
  numberOfBedrooms: {
    type: Number,
  },
  numberOfBathrooms: {
    type: Number,
  },
  garageParkingSpaces: {
    type: String,
  },
  yearBuilt: {
    type: Number,
  },
  heatingType: {
    type: String,
  },
  energySource: {
    type: String,
  },
  energyEfficiencyClass: {
    type: String,
  },
  additionalFeatures: {
    type: String,
  },
});

const ResidentialHousesModel = mongoose.model<IResidentialHouses>(
  'ResidentialHouses',
  ResidentialHousesSchema,
);
export default ResidentialHousesModel;
