import { Card, CardHeader, CardBody, Button } from '@material-tailwind/react';
import { useContext, useRef, useState, useEffect } from 'react';
import { NewBingoContext } from '../../../context/NewBingoContext';

const BackgroundImage = ({ customBingoCard }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const { bingo, updateBingo } = useContext(NewBingoContext);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bingo.bingo_appearance && bingo.bingo_appearance.background_image) {
      setBackgroundImage(bingo.bingo_appearance.background_image);
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

      
      setBackgroundImage(image);

      
      updateBingo((prevState) => ({
        ...prevState,
        bingo_appearance: {
          ...prevState.bingo_appearance,
          background_image: image,
        },
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="mt-6 w-60 h-80 ">
      <input
        type="file"
        id="headerUpload"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <CardHeader
        className="relative h-56 bg-blue-gray-100 flex justify-center items-center cursor-pointer"
        onClick={handleHeaderUpload}
      >
        {!backgroundImage ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        ) : (
          <img src={backgroundImage} alt="Imagen de fondo" />
        )}
      </CardHeader>
      <CardBody className="text-justify m-auto">
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
      </CardBody>
    </Card>
  );
};

export default BackgroundImage;
