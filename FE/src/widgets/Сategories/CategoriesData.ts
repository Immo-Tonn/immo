export type CategoryItem = {
  id: number;
  title: string;
  image: string;
};

export const CategoriesData: CategoryItem[] = [
  {
    id: 1,
    title: 'Verkaufssupport',
    image: '/src/shared/assets/categories/verkaufssupport.svg',
  },
  {
    id: 2,
    title: 'Immobilienangebote',
    image: '/src/shared/assets/categories/immo-angeboten.svg',
  },
  {
    id: 3,
    title: 'Recht und Rat',
    image: '/src/shared/assets/categories/react-und-rat.svg',
  },
  {
    id: 4,
    title: 'Objektstyling',
    image: '/src/shared/assets/categories/object-styling.svg',
  },
  {
    id: 5,
    title: 'Referenzen',
    image: '/src/shared/assets/categories/referenzen.svg',
  },
  {
    id: 6,
    title: 'Unser Team',
    image: '/src/shared/assets/categories/unser-team.svg',
  },
];
