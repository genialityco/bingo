import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from '@material-tailwind/react';
import { useState } from 'react';

const DialogGenerateBallots = ({openDialogGenerateBallots,setOpenDialogGenerateBallots, handleNumValuesToPlayChange}) => {

  const[generateBallots, setGenerateBallots]=useState(null);


const handleNumBallotsToGenerate=(e)=>{
  setGenerateBallots(e.target.value);
  handleNumValuesToPlayChange(generateBallots)
}

  return (
    <Dialog open={openDialogGenerateBallots} size="xs"  handler={setOpenDialogGenerateBallots}>
      <div className="flex items-center justify-between">
        <DialogHeader className="flex flex-col items-start">
          Gestionar Valores
        </DialogHeader>
        {/* Icono X */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-3 h-5 w-5"
          onClick={()=>setOpenDialogGenerateBallots(!openDialogGenerateBallots)}
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <DialogBody>
        {/* establecer cantidad */}
        <Typography color="gray" variant="lead">
          Cantidad a generar
        </Typography>
        <div className="w-1/4  flex justify-around">
   {/*        <button
            className={`w-10 border-2  hover:bg-violet-600  focus:ring-violet-300`}
            onClick={() => handleNumValuesToPlayChange(3)}
          >
            3
          </button>
          <button
            className={`w-10 border-2 hover:bg-violet-600  focus:ring-violet-300`}
            onClick={() => handleNumValuesToPlayChange(5)}
          >
            5
          </button>
          <button
            className={`w-10 border-2  hover:bg-violet-600  focus:ring-violet-300`}
            onClick={() => handleNumValuesToPlayChange(10)}
          >
            10
          </button>
          <button
            className={`w-10 border-2 hover:bg-violet-600  focus:ring-violet-300`}
             onClick={() => handleNumValuesToPlayChange(75)}
          >
            75
          </button> */}
         <input type="number" onChange={handleNumBallotsToGenerate}/>
        </div>
        {/* establecer el tema */}
        {/* <Typography className="mb-3 " color="gray" variant="lead">
          Tema del Cartón
        </Typography> */}
        <div className="grid grid-cols-3 gap-3">
          {/* Numeros */}
          {/* <Button
            className={`bg-gray-200 cursor-pointer text-gray-700  text-center`}
            name="default"
            // onClick={(e) => handleCreateNewBingo(e, 'default')}
          >
            <h6>Numeros</h6>
          </Button> */}
          {/* Texto */}
          {/* <Button
            className={`h-10 bg-gray-200 cursor-pointer  text-gray-700 text-center `}
            name="text"
            // onClick={(e) => handleCreateNewBingo(e, 'text')}
          >
            <h6>Texto</h6>
          </Button> */}
          {/* Imagenes */}
          {/* <Button
            className={`h-10 bg-gray-200 cursor-pointer text-gray-700  text-center `}
            name="image"
            // onClick={(e) => handleCreateNewBingo(e, 'image')}
          >
            <h6>Imagenes</h6>
          </Button> */}
          <Button
            className={`h-10 mt-3 bg-gray-200 cursor-pointer text-gray-700  text-center `}
            name="image"
            // onClick={(e) => handleCreateNewBingo(e, 'image')}
            onClick={handleNumBallotsToGenerate}
          >
            <h6>Enviar</h6>
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default DialogGenerateBallots;
