export interface Address {
  country: string;
  city: string;
  zip: number;
  district: string;
  street: string;
  houseNumber?: string;
}

export interface Image {
  _id: string;
  id: string;
  url: string;
  type: string;
}

export interface Video {
  id: string;
  videoId: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  dateAdded: string;
}

export interface Apartment {
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

export interface CommercialBuilding {
  buildingType: string;
  area?: number;
  yearBuilt?: number;
  purpose?: string;
  additionalFeatures?: string;
}

export interface LandPlot {
  plotArea: number;
  infrastructureConnection?: string;
  buildingRegulations?: string;
  recommendedUsage?: string;
}

export interface ResidentialHouse {
  type?: string;
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

export interface RealEstateObject {
  _id: string;
  number: string;
  type: string;
  title: string;
  description: string;
  features?: string;
  miscellaneous?: string;
  location: string;
  address: Address;
  price: number;
  dateAdded: string;
  status: string;
  images?: Image[];
  videos?: Video[];
  apartments?: Apartment;
  commercial_NonResidentialBuildings?: CommercialBuilding;
  landPlots?: LandPlot;
  residentialHouses?: ResidentialHouse;
  freeWith?: string;
}

export interface PropertyHeroProps {
  object: RealEstateObject;
  images?: string[];
  apartment?: Apartment;
  residentialHouse?: ResidentialHouse;
  landPlot?: LandPlot;
  commercialBuilding?: CommercialBuilding;
}
