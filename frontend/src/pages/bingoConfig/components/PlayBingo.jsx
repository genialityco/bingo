import { Card, Typography, Button } from '@material-tailwind/react';

const PlayBingo = () => {
  return (
    <div>

      <div className='my-8 flex justify-between items-center'>
        <Typography variant="h5">Panel de Control del Bingo</Typography>
        <Button className="flex items-center gap-3">Iniciar Bingo</Button>
      </div>

      <div className="my-5 flex flex-col sm:flex-row justify-evenly">
        <Card className="h-40 w-40 border-2"></Card>
        <Card className="h-40 w-40 border-2"></Card>
        <Card className="h-40 w-40 border-2"></Card>
      </div>

      <Card className="h-40 w-full border-2 m-auto"></Card>
    </div>
  )
}

export default PlayBingo;
