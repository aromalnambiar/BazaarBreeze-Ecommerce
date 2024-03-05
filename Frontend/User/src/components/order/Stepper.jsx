import React from "react";

const StyledStepper = ({ status}) => {
  const statusArray = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
  const currentStep = statusArray.indexOf(status);
  const numberOfSteps = statusArray.length;
  console.log("stepper status : ",status)
  const activeColor = (index) => (currentStep >= index ? "bg-blue-500" : "bg-gray-300");
  const isFinalStep = (index) => index === numberOfSteps - 1;

  return (
    <div className="container  mx-auto w-[140%] my-8 p-4 bg-white  rounded-md">
      <div className="flex items-center justify-between mb-4">
        {statusArray.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${activeColor(index)}`}>{isFinalStep(index) ? "✔" : index + 1}</div>
              <div className="mt-2 text-sm text-gray-600">{status}</div>
            </div>
            {isFinalStep(index) ? null : <div className={`flex-1 h-1 bg-gray-300 mx-2 ${activeColor(index)} `}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StyledStepper;
