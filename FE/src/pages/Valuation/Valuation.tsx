import Competence from '@widgets/Competence/Competence';
import HowIsGoing from '@widgets/HowIsGoing/HowIsGoing';
import Intro from '@widgets/Intro/Intro';
import ValuationCTA from '@widgets/ValuationCTA/ValuationCTA';

const Valuation = () => {
  return (
    <>
      <Intro /> <ValuationCTA /> <Competence /> <HowIsGoing />
    </>
  );
};
export default Valuation;
