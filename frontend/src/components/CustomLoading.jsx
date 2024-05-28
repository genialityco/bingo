import { Spinner, Typography } from "@material-tailwind/react";
import { useLoading } from "../context/LoadingContext";

export const CustomLoading = ({ text = "Estamos cargando la información" }) => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
      <div className="flex flex-col items-center justify-center">
        <Spinner className="w-2/5 h-2/5" color="blue" />
        <Typography variant="h5" color="blue">{text}</Typography>
      </div>
    </div>
  );
};
