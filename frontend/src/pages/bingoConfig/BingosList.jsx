import { Card, CardBody } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import bingoService from '../../services/bingoService';

const BingosList = () => {
  const [bingos, setBingos] = useState([]);
  console.log(bingos);

  useEffect(() => {
    console.log("se ejecuta")
    const getBingos = async () => {
      const response = await bingoService.listAllBingos();
      console.log(response)
      setBingos(response.data);
    };
    getBingos();
  }, []);

  return (
    <div className='w-11/12 m-auto my-8 p-3 bg-blue-gray-300 flex flex-col md:flex-row md:items-center justify-center  gap-3  text-center'>
    <Card className="bg-blue-gray-100">
      <CardBody>
        {bingos.map((item) => {
          return (
            <>
              <h4>{item.title}</h4>
              <img src={item?.bingoValues[0]?.imageUrl} alt="" />
            </>
          );
        })}
      </CardBody>
    </Card>
    <Card className="bg-blue-gray-100">
      <CardBody>
        {bingos.map((item) => {
          return (
            <>
              <h4>{item.title}</h4>
            </>
          );
        })}
      </CardBody>
    </Card>
    <Card className="bg-blue-gray-100">
      <CardBody>
        {bingos.map((item) => {
          return (
            <>
              <h4>{item.title}</h4>
            </>
          );
        })}
      </CardBody>
    </Card>
    </div>
  );
};

export default BingosList;
