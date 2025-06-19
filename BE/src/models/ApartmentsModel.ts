import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IApartments extends Document {
  id: Types.ObjectId;
  realEstateObject: Types.ObjectId;
  type: string;
  floor?: number;
  totalFloors?: number;
  livingArea: number;
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  yearBuilt?: number;
  yearRenovated?: number;
  heatingType?: string;
  energySource?: string;
  energyEfficiencyClass?: string;
  additionalFeatures?: string;
}

const ApartmentsSchema: Schema = new Schema<IApartments>({
  realEstateObject: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstateObjects',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
  },
  totalFloors: {
    type: Number,
  },
  livingArea: {
    type: Number,
    required: true,
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
  yearBuilt: {
    type: Number,
  },
  yearRenovated: {
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

const ApartmentsModel = mongoose.model<IApartments>(
  'Apartments',
  ApartmentsSchema,
);
export default ApartmentsModel;
