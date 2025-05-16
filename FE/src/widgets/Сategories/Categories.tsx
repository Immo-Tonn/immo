import { CategoriesData, CategoryItem } from './CategoriesData';
import styles from './Categories.module.css';
import { NavLink } from 'react-router-dom';

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      <ul className={styles.categoriesList}>
        {CategoriesData.map((item: CategoryItem) => (
          <li key={item.id} className={styles.categoryItem}>
            <NavLink to={item.link} className={styles.categoryLink}>
              <p className={styles.categoryTitle}>{item.title}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.categoryImage}
                />
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
