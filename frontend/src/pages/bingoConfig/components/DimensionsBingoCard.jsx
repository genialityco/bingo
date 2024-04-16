import { useEffect, useState } from 'react';
import {
  Card,
  Carousel,
  Typography,
  Input,
  Textarea,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

const TABLE_HEAD = ['Tipo de Cartón', 'Valor de la Balota', 'Opciones'];

const DimensionsBingoCard = () => {
  const [dimension, setDimension] = useState('');
  console.log('valor dimension:', dimension);
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [bingoValuesToRender, setBingoValuesToRender] = useState([]);

  console.log('valores a renderizar:', bingoValuesToRender);

  useEffect(() => {
    const changeValuesBingo = (dimension) => {
      switch (dimension) {
        case '3x3':
          return bingoConfing3.bingoValues;
        case '4x4':
          return bingoConfig2.bingo_values;
        // case '5x5':
        //   return bingoConfing3.bingovalues;
        default:
          return [];
      }
    };
    setBingoValuesToRender(changeValuesBingo(dimension));
  }, [dimension]);

  const handleOpenOne = () => setOpenOne(!openOne);
  const handleOpenTwo = () => setOpenTwo(!openTwo);

  return (
    // <div className=" grid grid-cols-1 gap-8 sm:grid-cols-auto-2 ">
    <div className=" flex flex-col lg:flex-row gap-3 ">
      {/* 1st Card Tittle and Dimenstions */}
      <Card className="w-2/5 bg-white p-5 flex justify-center items-center gap-3 border-gray-50 border-2 text-center">
        <Typography variant="h5" className="text-center">
          Titulo
        </Typography>
        <div className="w-72">
          <Input
            type="text"
            placeholder="Titulo"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: 'hidden',
            }}
            containerProps={{ className: 'min-w-[100px]' }}
          />
        </div>
        <Carousel
          className="rounded-xl h-full w-full bg-blue-gray-50"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="w-20 absolute bottom-4 left-2/4 z-50 -translate-x-2/4 flex justify-evenly items-center">
              {new Array(length).fill('').map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                    activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          <Button
            color="white"
            className="m-8"
            onClick={() => {
              setDimension('3x3');
            }}
          >
            <div className=" grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="square w-6 h-6 m-auto bg-blue-500"
                ></div>
              ))}
            </div>
            <Typography className="text-center">3x3</Typography>
          </Button>

          <Button
            color="white"
            className="m-8"
            onClick={() => {
              setDimension('4x4');
            }}
          >
            <div className="grid grid-cols-4 grid-cols-auto grid-rows-4 gap-1 justify-center items-center">
              {[...Array(16)].map((_, index) => (
                <div
                  key={index}
                  className="square w-6 h-6 m-auto bg-blue-500"
                ></div>
              ))}
            </div>
            <Typography className="text-center">4x4</Typography>
          </Button>

          <Button
            color="white"
            className="m-8"
            onClick={() => {
              setDimension('5x5');
            }}
          >
            <div className="grid grid-cols-5 grid-rows-5 gap-1 justify-center items-center">
              {[...Array(25)].map((_, index) => (
                <div
                  key={index}
                  className="square w-5 h-5 m-auto bg-blue-500"
                ></div>
              ))}
            </div>
            <Typography className="text-center m-0">5x5</Typography>
          </Button>
        </Carousel>

        <div className="w-80">
          <Textarea label="Message" />
        </div>
      </Card>

      {/* 2nd Card Bingo Values */}
      <Card className="w-full bg-blue-gray-100 p-5 border-2 hover:shadow-2xl">
        <Typography variant="h5" className="mb-3">
          Valores del Bingo
        </Typography>
        <div className="mb-3 flex justify-center gap-2">
          <Button variant="gradient" className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Importar valores del Bingo
          </Button>
          <Button
            variant="gradient"
            className="flex items-center gap-3"
            onClick={handleOpenOne}
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Agregar
          </Button>
        </div>

        {/* Table */}
        <Card className="m-auto h-96 w-11/12 overflow-scroll overflow-y-auto">
          <table className="w-full min-w-max table-auto text-center">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tbody>
                {bingoValuesToRender?.map((item) => (
                  <tr key={item.id}>
                    <td>Hola</td>
                    <td className="py-3 bg-gray-100">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.value}
                      </Typography>
                    </td>
                    <td className="py-2 bg-gray-300 flex flex-col items-center justify-center ">
                      <button
                        className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                        type="button"
                        onClick={handleOpenTwo}
                      >
                        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                          </svg>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </tbody>
          </table>
        </Card>
      </Card>

      {/* Dialog */}
      <Dialog open={openOne} size="xs" handler={handleOpenOne}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            {' '}
            <Typography className="mb-1" variant="h4">
              New message to @{' '}
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpenOne}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
            Gestionar Valores
          </Typography>
          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Username
            </Typography>
            <Input label="Username" />
            <Textarea label="Message" />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleOpenOne}>
            cancel
          </Button>
          <Button variant="gradient" color="gray" onClick={handleOpenOne}>
            send message
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog */}
      <Dialog open={openTwo} size="xs" handler={handleOpenTwo}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            {' '}
            <Typography className="mb-1" variant="h4"></Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpenTwo}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
            Gestionar Valores
          </Typography>
          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Username
            </Typography>
            <Input label="Username" />
            <Textarea label="Message" />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2"></DialogFooter>
      </Dialog>
    </div>
  );
};

export default DimensionsBingoCard;


{/* <tr>
  <td></td>
  <td className="py-3 bg-gray-100">
    {bingoValuesToRender.map((item) => {
      return (
        <Typography
          key={item.id}
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {item.value}{' '}
        </Typography>
      );
    })}
  </td>
  <td className="py-2 bg-gray-300 flex flex-col items-center justify-center ">
    {[...Array(79)].map((_, index) => (
      <button
        className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
        type="button"
        onClick={handleOpenTwo}
      >
        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </span>
      </button>
    ))}
    {[...Array(79)].map((_, index) => (
      <button
      className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
      type="button"
    >
      <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
     <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
       
      </span>
    </button>
 
  ))}
  </td>
</tr>; */}
