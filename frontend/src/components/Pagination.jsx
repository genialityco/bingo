import React from "react";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousClick = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center my-4">
      <Button
        variant="text"
        className="mx-1"
        onClick={handlePreviousClick}
        disabled={currentPage === 0}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
      {[...Array(totalPages)].map((_, index) => (
        <IconButton
          key={index}
          variant="text"
          color={index === currentPage ? "blue" : "gray"}
          className="mx-1"
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </IconButton>
      ))}
      <Button
        variant="text"
        className="mx-1"
        onClick={handleNextClick}
        disabled={currentPage === totalPages - 1}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
