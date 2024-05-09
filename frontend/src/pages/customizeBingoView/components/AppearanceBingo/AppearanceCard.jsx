import {
  Card,
  Chip,
} from '@material-tailwind/react';

import BannerBingo from './components/BannerBingo';
import FooterBingo from './components/FooterBingo';
import BackgroundImage from './components/BackgroundImage';
import MarkerImage from './components/MarkerImage';
import { useContext } from 'react';
import { NewBingoContext } from '../../context/NewBingoContext';


const AppearanceCard = () => {

  
  const { bingoCard, updateBingoCard } = useContext(NewBingoContext);


  const customBingoCard=(customBingo)=>{
    
    
  }

  return (
    <div>
      {/* Color */}
      <Card className="p-5 bg-gray-50 flex flex-row items-center gap-3">
        <div className="p-5 bg-blue-500 h-20 w-20 rounded-full"></div>
        <Chip
          size="sm"
          variant="ghost"
          value="HEX #00BCD4"
          className="w-24 p-2 cursor-pointer"
        />
        <Chip
          size="sm"
          variant="ghost"
          value="RGB (0,188,212)"
          className="w-28 p-2 cursor-pointer"
        />
      </Card>

      <div className="p-5 bg-blue-100 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 content-center justify-items-center">
        {/* HEADER */}
        <BannerBingo customBingoCard={customBingoCard} />

        {/* Imagen de fondo  */}
        <BackgroundImage  customBingoCard={customBingoCard} />

        {/* Imagen de marcación */}
        <MarkerImage customBingoCard={customBingoCard} />

        {/*  Footer*/}
        <FooterBingo customBingoCard={customBingoCard} />
      </div>
    </div>
  );
};

export default AppearanceCard;
