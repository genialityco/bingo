import { Carousel, Typography, Button } from '@material-tailwind/react';

const TemplateBingos = () => {
  return (
    <div>
      <Typography variant="h5" className="text-left my-2">
        Template Bingo
      </Typography>
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
        <Button color="white" className={`m-8 `}>
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

        <Button color="white" className={`m-8`}>
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

        <Button color="white" className={`m-8  `}>
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
    </div>
  );
};

export default TemplateBingos;
