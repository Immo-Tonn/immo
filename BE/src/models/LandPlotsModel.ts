import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILandPlots extends Document {
  id: Types.ObjectId;
  realEstateObject: Types.ObjectId;
  plotArea: number;
  infrastructureConnection?: string;
  buildingRegulations?: string;
  recommendedUsage?: string;
}

const LandPlotsSchema: Schema = new Schema<ILandPlots>({
  realEstateObject: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstateObjects',
    required: true,
  },
  plotArea: {
    type: Number,
    required: true,
  },
  infrastructureConnection: {
    type: String,
  },
  buildingRegulations: {
    type: String,
  },
  recommendedUsage: {
    type: String,
  },
});

const LandPlotsModel = mongoose.model<ILandPlots>('LandPlots', LandPlotsSchema);
export default LandPlotsModel;
