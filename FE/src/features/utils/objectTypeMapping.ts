import { ObjectType } from './types';

// Централизованный маппинг типов объектов
export const OBJECT_TYPE_LABELS = {
  [ObjectType.APARTMENT]: 'Wohnung',
  [ObjectType.HOUSE]: 'Wohnhaus', 
  [ObjectType.LAND]: 'Grundstück',
  [ObjectType.COMMERCIAL]: 'Gewerbe-/Nichtwohnimmobilien',
} as const;

// Function to get the display name of an object type
export const getObjectTypeLabel = (type: ObjectType): string => {
  return OBJECT_TYPE_LABELS[type] || type;
};

// Array for generating select options
export const OBJECT_TYPE_OPTIONS = Object.entries(OBJECT_TYPE_LABELS).map(([value, label]) => ({
  value: value as ObjectType,
  label,
}));