import AboutUs from '@widgets/AboutUs/AboutUs';
import FiveSteps from '@widgets/FiveSteps/FiveSteps';
import HeroHome from '@widgets/hero/HeroHome/HeroHome';
import Categories from '@widgets/Categories/Categories';

const Home = () => {
  return (
    <>
      <HeroHome />
      <Categories />
      <AboutUs />
      <FiveSteps />
    </>
  );
};
export default Home;
