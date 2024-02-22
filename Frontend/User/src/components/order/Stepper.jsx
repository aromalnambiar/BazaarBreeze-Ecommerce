import React, { useEffect, useState } from "react";

const Stepper = ({ status }) => {
  const statusArray = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
  const currentStep = statusArray.indexOf(status);
  const numberOfSteps = statusArray.length;
  
  const activeColor = (index) => (currentStep >= index ? "bg-blue-500" : "bg-gray-300");
  const isFinalStep = (index) => index === numberOfSteps - 1;

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-md">
      <div className="flex items-center mb-8">
        {statusArray.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${activeColor(index)}`}>{isFinalStep(index) ? "✔" : index + 1}</div>
              <div className="mt-2 text-sm text-gray-600">{status}</div>
            </div>
            {isFinalStep(index) ? null : <div className={`w-20 h-1 self-start mt-3 ${activeColor(index)} `}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
