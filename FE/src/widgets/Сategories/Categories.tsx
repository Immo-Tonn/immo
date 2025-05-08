import { CategoriesData, CategoryItem } from './CategoriesData';
import styles from './Categories.module.css';

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      <ul className={styles.categoriesList}>
        {CategoriesData.map((item: CategoryItem) => (
          <li key={item.id} className={styles.categoryItem}>
            <a className={styles.categoryLink}>
              <p className={styles.categoryTitle}>{item.title}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.categoryImage}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
