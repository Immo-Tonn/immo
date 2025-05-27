export interface Address {
  city: string;
  district: string;
  zip: number;
}

export interface Image {
  id: string;
  url: string;
  type: string;
}

export interface Apartment {
  livingArea?: number;
  numberOfRooms?: number;
}

export interface LandPlot {
  plotArea?: number;
}

export interface ResidentialHouse {
  livingArea?: number;
  numberOfRooms?: number;
  plotArea?: number;
}

export interface CommercialBuilding {
  area?: number;
}

export interface RealEstateObject {
  title: string;
  description: string;
  address: Address;
  price: number;
  images?: Image[];
}

export interface PropertyHeroProps {
  object: RealEstateObject;
  images?: Image[];
  apartment?: Apartment;
  residentialHouse?: ResidentialHouse;
  landPlot?: LandPlot;
  commercialBuilding?: CommercialBuilding;
}
