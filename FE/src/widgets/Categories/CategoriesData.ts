import immoAngeboten from '/src/shared/assets/categories/immo-angeboten.webp';
import verkaufsSupport from '/src/shared/assets/categories/verkaufssupport.webp';
import rechtUndRat from '/src/shared/assets/categories/react-und-rat.webp';
import objektStyling from '/src/shared/assets/categories/object-styling.webp';
import werterMittlung from '/src/shared/assets/categories/wertemittlung.webp';
import finanzierung from '/src/shared/assets/categories/finanzirung.webp';

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
    image: immoAngeboten,
    link: 'immobilien',
    alt: 'immobilienangebote',
  },
  {
    id: 2,
    title: 'Verkaufssupport',
    image: verkaufsSupport,
    link: 'verkaufssupport',
    alt: 'verkaufssupport',
  },

  {
    id: 3,
    title: 'Recht und Rat',
    image: rechtUndRat,
    link: 'recht-und-rat',
    alt: 'recht-und-rat',
  },
  {
    id: 4,
    title: 'Objektstyling',
    image: objektStyling,
    link: 'objectstyling',
    alt: 'objektstyling',
  },
  {
    id: 5,
    title: 'wertermittlung',
    image: werterMittlung,
    link: 'wertermittlung',
    alt: 'wertermittlung',
  },
  {
    id: 6,
    title: 'finanzierung',
    image: finanzierung,
    link: 'finanzierung',
    alt: 'finanzierung',
  },
];
