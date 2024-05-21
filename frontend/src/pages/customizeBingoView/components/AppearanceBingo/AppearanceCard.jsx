import {
  Typography
} from '@material-tailwind/react';
import BackgroundColor from './components/BackgroundColor';
import BannerBingo from './components/BannerBingo';
import FooterBingo from './components/FooterBingo';
import BackgroundImage from './components/BackgroundImage';
import MarkerImage from './components/MarkerImage';
import { useContext, useEffect, useState } from 'react';
import { NewBingoContext } from '../../context/NewBingoContext';



const AppearanceCard = ({ appearanceBingoCarton }) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  console.log(bingo);
  const [appearance, setAppearance] = useState({});
  console.log(appearance);

  const customBingoCard = (customBingo) => {
    setAppearance(customBingo.bingo_appearance);
  };
  useEffect(() => {
    appearanceBingoCarton(appearance);
  }, [appearance]);

  return (
    <div>
      {/* Color */}
      <BackgroundColor/>

      <div className="p-5 bg-blue-100 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 content-center justify-items-center">
        {/* HEADER */}
        <div>
          <Typography variant="h5" className="pb-3 text-center">
            Imagen del Banner
          </Typography>
          <BannerBingo customBingoCard={customBingoCard} />
        </div>

        {/* Imagen de fondo  */}
        <div>
          <Typography variant="h5" className="pb-3 text-center">
            Imagen de Fondo
          </Typography>
          <BackgroundImage customBingoCard={customBingoCard} />
        </div>

        {/* Imagen de marcación */}
        <div>
          <Typography variant="h5" className="pb-3 text-center">
            Imagen de Marcación
          </Typography>
          <MarkerImage customBingoCard={customBingoCard} />
        </div>

        {/*  Footer*/}
        <div>
          <Typography variant="h5" className="pb-3 text-center">
            Imagen de Footer
          </Typography>
          <FooterBingo customBingoCard={customBingoCard} />
        </div>
      </div>
    </div>
  );
};

export default AppearanceCard;
