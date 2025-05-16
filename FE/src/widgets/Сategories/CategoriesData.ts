export type CategoryItem = {
  id: number;
  title: string;
  image: string;
  link: string;
};

export const CategoriesData: CategoryItem[] = [
  {
    id: 1,
    title: 'Verkaufssupport',
    image: '/src/shared/assets/categories/verkaufssupport.svg',
    link: 'verkaufssupport',
  },
  {
    id: 2,
    title: 'Immobilienangebote',
    image: '/src/shared/assets/categories/immo-angeboten.svg',
    link: 'immobilienangebote',
  },
  {
    id: 3,
    title: 'Recht und Rat',
    image: '/src/shared/assets/categories/react-und-rat.svg',
    link: 'recht-und-rat',
  },
  {
    id: 4,
    title: 'Objektstyling',
    image: '/src/shared/assets/categories/object-styling.svg',
    link: 'objectstyling',
  },
  {
    id: 5,
    title: 'Referenzen',
    image: '/src/shared/assets/categories/referenzen.svg',
    link: 'referenzen',
  },
  {
    id: 6,
    title: 'Unser Team',
    image: '/src/shared/assets/categories/unser-team.svg',
    link: 'unser-team',
  },
];
