import Competence from '@widgets/Competence/Competence';
import HowIsGoing from '@widgets/HowIsGoing/HowIsGoing';
import ValuationCTA from '@widgets/ValuationCTA/ValuationCTA';
import HeroValuation from '@widgets/hero/HeroValuation/HeroValuation.module';

const Valuation = () => {
  return (
    <>
      <HeroValuation /> <ValuationCTA /> <Competence /> <HowIsGoing />
    </>
  );
};
export default Valuation;
