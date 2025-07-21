export type CategoryItem = {
  id: number;
  title: string;
  image: string;
  link: string;
  alt: string;
};

export const CategoriesData: CategoryItem[] = [
  {
    id: 1,
    title: 'Immobilienangebote',
    image: '/src/shared/assets/categories/immo-angeboten.webp',
    link: 'immobilien',
    alt: 'immobilienangebote',
  },
  {
    id: 2,
    title: 'Verkaufssupport',
    image: '/src/shared/assets/categories/verkaufssupport.webp',
    link: 'verkaufssupport',
    alt: 'verkaufssupport',
  },

  {
    id: 3,
    title: 'Recht und Rat',
    image: '/src/shared/assets/categories/react-und-rat.webp',
    link: 'recht-und-rat',
    alt: 'recht-und-rat',
  },
  {
    id: 4,
    title: 'Objektstyling',
    image: '/src/shared/assets/categories/object-styling.webp',
    link: 'objectstyling',
    alt: 'objektstyling',
  },
  {
    id: 5,
    title: 'wertermittlung',
    image: '/src/shared/assets/categories/wertemittlung.webp',
    link: 'wertermittlung',
    alt: 'wertermittlung',
  },
  {
    id: 6,
    title: 'finanzierung',
    image: '/src/shared/assets/categories/finanzirung.webp',
    link: 'finanzierung',
    alt: 'finanzierung',
  },
];
