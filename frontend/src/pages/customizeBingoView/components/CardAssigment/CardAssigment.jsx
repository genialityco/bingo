import { Button, Card, Typography, Input } from '@material-tailwind/react';

const CardAssigment = () => {
  return (
    <div className="my-10 grid grid-cols-1 gap-8 sm:grid-cols-auto-2 content-center justify-items-center">
      <Card className="w-1/2 p-5 h-96 border-2 flex flex-col gap-3">
        <Typography variant="h6">Lista de Participantes</Typography>
        <Button className="bg-gray-500">Generar cartones a todos</Button>
        <Button className="bg-gray-500">Generar cartones faltantes</Button>
        <Button className="bg-transparent text-black">
          Descargar cartones
        </Button>
        <div className="w-72">
          <Input
            label="Buscar participante"
            icon={
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
          />
        </div>
      </Card>
      {/* <Card className="w-1/2 h-96 border-2"></Card> */}
    </div>
  );
};

export default CardAssigment;
