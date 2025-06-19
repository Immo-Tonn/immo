// immo/FE/src/shared/utils/objectNumberUtils.ts

/**
 * Преобразует MongoDB ObjectId в удобный для чтения номер объекта
 * @param objectId - MongoDB ObjectId (например, "682d5e54b861592854f85e12")
 * @returns Читаемый номер объекта (например, "OBJ-682D-5E54")
 */
export const formatObjectNumber = (objectId: string): string => {
  if (!objectId || objectId.length < 12) {
    return 'OBJ-INVALID';
  }
  
  // Берем первые 8 символов ID и разбиваем на группы по 4
  const shortId = objectId.substring(0, 8).toUpperCase();
  const part1 = shortId.substring(0, 4);
  const part2 = shortId.substring(4, 8);
  
  return `OBJ-${part1}-${part2}`;
};

/**
 * Преобразует читаемый номер объекта обратно в поисковый паттерн
 * @param objectNumber - Читаемый номер объекта (например, "OBJ-682D-5E54")
 * @returns Поисковый паттерн для MongoDB (например, "682d5e54")
 */
export const parseObjectNumber = (objectNumber: string): string => {
  if (!objectNumber || !objectNumber.startsWith('OBJ-')) {
    return '';
  }
  
  // Удаляем префикс и дефисы, приводим к нижнему регистру
  return objectNumber
    .replace('OBJ-', '')
    .replace(/-/g, '')
    .toLowerCase();
};

/**
 * Проверяет валидность формата номера объекта
 * @param objectNumber - Номер объекта для проверки
 * @returns true если формат корректный
 */
export const isValidObjectNumber = (objectNumber: string): boolean => {
  const pattern = /^OBJ-[0-9A-F]{4}-[0-9A-F]{4}$/i;
  return pattern.test(objectNumber);
};

/**
 * Генерирует отображаемую информацию об объекте для карточки
 * @param objectData - Данные объекта
 * @returns Объект с форматированными данными для отображения
 */
export const formatObjectDisplayInfo = (objectData: any) => {
  const objectNumber = formatObjectNumber(objectData._id || objectData.id);
  const price = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(objectData.price);

  const address = objectData.address ? 
    `${objectData.address.zip} ${objectData.address.city}, ${objectData.address.district}` : 
    objectData.location || 'Адрес не указан';

  return {
    objectNumber,
    price,
    address,
    title: objectData.title,
    type: objectData.type,
    description: objectData.description,
    mainImage: objectData.images && objectData.images.length > 0 ? objectData.images[0] : null,
  };
};