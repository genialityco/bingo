import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react';
import { useRef } from 'react';

const MarkerImage = () => {
  const fileInputRef = useRef(null);

  const handleHeaderUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Aquí puedes manejar la lógica para subir el archivo a tu servidor o procesarlo de acuerdo a tus necesidades
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
      </CardHeader>
      <CardBody className="text-justify">
        <Typography>
          Haga click o arrastre el archivo o esta area para cargarlo
        </Typography>
        <Typography variant="h6">Dimensiones sugeridas:</Typography>
        <span>728px * 728px</span>
        <Typography variant="h6"> Formatos aceptados: </Typography>
        <span>.png, .jpeg, .jpg, .gif</span>
      </CardBody>
    </Card>
  );
};

export default MarkerImage;
