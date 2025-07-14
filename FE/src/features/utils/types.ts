export enum ObjectType {
  LAND = 'Land Plots',
  HOUSE = 'Residential Houses',
  APARTMENT = 'Apartments',
  COMMERCIAL = 'Commercial/Non-Residential Buildings',
}

export enum ObjectStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  ARCHIVED = 'archived',
  RESERVED = 'reserved',
}

export enum ImageType {
  MAIN = 'main',
  PLAN = 'plan',
  ADDITIONAL = 'additional',
}

// Interface for a basic real estate object
export interface IRealEstateObject {
  id?: string;
  type: ObjectType;
  title: string;
  description: string;
  features?: string;
  miscellaneous?: string;
  location: string;
  address: {
    country: string;
    city: string;
    zip: string | number;
    district: string;
    street: string;
    houseNumber?: string;
  };
  price: string | number;
  dateAdded?: Date;
  status?: ObjectStatus;
  images?: string[];
}

// Interface for apartment
export interface IApartment {
  id?: string;
  realEstateObject: string;
  type?: string;
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

// Interface for resident house
export interface IResidentialHouse {
  id?: string;
  realEstateObject: string;
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

// Interface for landplot
export interface ILandPlot {
  id?: string;
  realEstateObject: string;
  plotArea: number;
  landPlottype?: string;
  infrastructureConnection?: string;
  buildingRegulations?: string;
  recommendedUsage?: string;
}

// Интерфейс для коммерческой/нежилой недвижимости
export interface ICommercialNonResidentialBuilding {
  id?: string;
  realEstateObject: string;
  buildingType: string;
  area?: number;
  yearBuilt?: number;
  purpose?: string;
  additionalFeatures?: string;
}

// Интерфейс для изображения
export interface IImage {
  id?: string;
  realEstateObject: string;
  url: string;
  type: ImageType;
}
