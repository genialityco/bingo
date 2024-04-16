import {
  Card,
  Chip,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from '@material-tailwind/react';

const AppearanceCard = () => {
  return (
    <div>
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
        {/* Card 1 */}
        <Card className="mt-6 w-60 h-80">
          <CardHeader className="relative h-56 bg-blue-gray-100 border-dashed border-3"></CardHeader>
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

        {/* Card 2 */}
        <Card className="mt-6 w-60 h-80 ">
          <CardHeader className="relative h-56 bg-blue-gray-100 flex justify-center items-center">
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
            <Typography variant='h6'> Formatos aceptados: </Typography>
            <span>.png, .jpeg, .jpg, .gif</span>
          </CardBody>
        </Card>

        {/* Card 3 */}
        <Card className="mt-6 w-60 h-80 ">
          <CardHeader className="relative h-56 bg-blue-gray-100 flex justify-center items-center">
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
            <Typography variant='h6'> Formatos aceptados: </Typography>
            <span>.png, .jpeg, .jpg, .gif</span>
          </CardBody>
        </Card>


        {/* Card 4 */}
        <Card className="mt-6 w-60 h-80">
          <CardHeader className="relative h-56 bg-blue-gray-100 border-dashed border-3"></CardHeader>
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
      </div>
    </div>
  );
};

export default AppearanceCard;
