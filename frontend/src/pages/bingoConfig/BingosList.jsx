import { Button, Card, CardBody } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import bingoService from '../../services/bingoService';
import { Link } from 'react-router-dom';

const BingosList = () => {
  const [bingos, setBingos] = useState([]);
 

  useEffect(() => {
    const getBingos = async () => {
      const response = await bingoService.listAllBingos();
      setBingos(response.data);
    };
    getBingos();
  }, []);

  return (
    <div className="w-11/12 m-auto my-8 p-3">
      <Card className="flex flex-col md:flex-row md:items-center justify-center  gap-3  text-center ">
        {bingos.map((bingo) => {
          return (
            <Link to={`/bingo-config?id=${bingo._id}`}>
              <Card className="bg-blue-gray-100">
                <CardBody>
                  <h3>{bingo.title}</h3>
                  <p>{bingo.dimensions}</p>
                </CardBody>
                <Button>Editar Template</Button>
              </Card>
            </Link>
          );
        })}
      </Card>
    </div>
  );
};

export default BingosList;
