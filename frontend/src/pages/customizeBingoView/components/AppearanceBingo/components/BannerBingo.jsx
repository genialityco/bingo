import { Card, CardHeader, CardFooter, Button } from '@material-tailwind/react';
import { useContext, useRef, useState, useEffect } from 'react';
import bingoHeader from '../../../../../assets/bingoHeader.png';
import { NewBingoContext } from '../../../context/NewBingoContext';

const BannerBingo = ({ customBingoCard }) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);

  const [imageBanner, setImageBanner] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bingo.bingo_appearance && bingo.bingo_appearance.banner) {
      setImageBanner(bingo.bingo_appearance.banner);
    }
  }, [bingo]);

  //mantener actualizado el estado bingo con la config y enviarlo al padre "AppearenceBingo"
  useEffect(() => {
    customBingoCard(bingo);
  }, [bingo]);

  const handleHeaderUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = reader.result;
      setImageBanner(image);

      // Actualizar el estado del contexto con la URL base64
      updateBingo((prevState) => ({
        ...prevState,
        bingo_appearance: { ...prevState.bingo_appearance, banner: image },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="mt-6 w-60 h-80">
      <input
        type="file"
        id="headerUpload"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <CardHeader
        className="relative h-56 flex justify-center items-center bg-blue-gray-100 border-dashed border-3 cursor-pointer"
        onClick={handleHeaderUpload}
      >
        <img src={!imageBanner ? bingoHeader : imageBanner} alt="header" />
      </CardHeader>
      <CardFooter className="pt-10 m-auto">
        <Button className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BannerBingo;
