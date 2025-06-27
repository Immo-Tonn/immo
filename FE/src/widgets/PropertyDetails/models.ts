import {
  RealEstateObject,
  Apartment,
  ResidentialHouse,
  LandPlot,
  CommercialBuilding,
} from '@shared/types/propertyTypes';

export interface PropertyDetailsProps {
  object: RealEstateObject;
  apartment?: Apartment;
  commercialBuilding?: CommercialBuilding;
  landPlot?: LandPlot;
  residentialHouse?: ResidentialHouse;
}
export const getPropertyDetails = (
  object: RealEstateObject,
  apartment?: Apartment,
  commercial?: CommercialBuilding,
  land?: LandPlot,
  house?: ResidentialHouse,
): Record<string, any> => ({
  Land: object.address?.country,
  'Nummer ID': object._id,
  Objektart: object.type,
  Wohnfläche: house?.livingArea ?? apartment?.livingArea,
  Grundstück: house?.plotArea ?? land?.plotArea,
  Nutzfläche: house?.usableArea,
  Baujahr: house?.yearBuilt ?? apartment?.yearBuilt ?? commercial?.yearBuilt,
  Zimmern: house?.numberOfRooms ?? apartment?.numberOfRooms,
  Schlafzimmer: house?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
  Badezimmer: house?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
  Etage: apartment?.floor,
  'Anzahl Etagen': apartment?.totalFloors ?? house?.numberOfFloors,
  Garage: house?.garageParkingSpaces,
  Energieeffizienzklasse:
    house?.energyEfficiencyClass ??
    apartment?.energyEfficiencyClass ??
    commercial?.additionalFeatures,
  Energieträger: house?.energySource ?? apartment?.energySource,
  Heizung: house?.heatingType ?? apartment?.heatingType,
  'Frei ab': object.freeWith,
  Nutzung: commercial?.purpose ?? land?.recommendedUsage,
  Infrastruktur: land?.infrastructureConnection,
  Bebauungsplan: land?.buildingRegulations,
});


// import {
//   RealEstateObject,
//   Apartment,
//   ResidentialHouse,
//   LandPlot,
//   CommercialBuilding,
// } from '@shared/types/propertyTypes';

// // export interface PropertyDetailsProps {
// //   object: RealEstateObject;
// //   apartment?: Apartment;
// //   commercialBuilding?: CommercialBuilding;
// //   landPlot?: LandPlot;
// //   residentialHouse?: ResidentialHouse;
// // }
// // export const getPropertyDetails = (
// //   object: RealEstateObject,
// //   apartment?: Apartment,
// //   commercial?: CommercialBuilding,
// //   land?: LandPlot,
// //   house?: ResidentialHouse,
// // ): Record<string, any> => ({
// //   Land: object.address?.country,
// //   'Nummer ID': object._id,
// //   Objektart: object.type,
// //   Wohnfläche: house?.livingArea ?? apartment?.livingArea,
// //   Grundstück: house?.plotArea ?? land?.plotArea,
// //   Nutzfläche: house?.usableArea,
// //   Baujahr: house?.yearBuilt ?? apartment?.yearBuilt ?? commercial?.yearBuilt,
// //   Zimmern: house?.numberOfRooms ?? apartment?.numberOfRooms,
// //   Schlafzimmer: house?.numberOfBedrooms ?? apartment?.numberOfBedrooms,
// //   Badezimmer: house?.numberOfBathrooms ?? apartment?.numberOfBathrooms,
// //   Etage: apartment?.floor,
// //   'Anzahl Etagen': apartment?.totalFloors ?? house?.numberOfFloors,
// //   Garage: house?.garageParkingSpaces,
// //   Energieeffizienzklasse:
// //     house?.energyEfficiencyClass ??
// //     apartment?.energyEfficiencyClass ??
// //     commercial?.additionalFeatures,
// //   Energieträger: house?.energySource ?? apartment?.energySource,
// //   Heizung: house?.heatingType ?? apartment?.heatingType,
// //   'Frei ab': object.freeWith,
// //   Nutzung: commercial?.purpose ?? land?.recommendedUsage,
// //   Infrastruktur: land?.infrastructureConnection,
// //   Bebauungsplan: land?.buildingRegulations,
// // });
