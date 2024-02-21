import React, { useState } from "react";

export default function Stepper() {
  const statusArray = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
  const [currentStep, setCurrentStep] = useState(0);

  const numberOfSteps = statusArray.length;
  const activeColor = (index) => (currentStep >= index ? "bg-blue-500" : "bg-gray-300");
  const isFinalStep = (index) => index === numberOfSteps - 1;

  const goToNextStep = () => setCurrentStep((prev) => (prev === numberOfSteps - 1 ? prev : prev + 1));
  const goToPreviousStep = () => setCurrentStep((prev) => (prev <= 0 ? prev : prev - 1));

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-md">
      {/* <h1 className="text-3xl text-center font-bold mb-20">Order Timeline</h1> */}
      <div className="flex  items-center mb-8">
        {statusArray.map((status, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col  items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${activeColor(index)}`}>{isFinalStep(index) ? "✔" : index + 1}</div>
              <div className="mt-2 text-sm text-gray-600">{status}</div>
            </div>
            {isFinalStep(index) ? null : <div className={`w-20 h-1 self-start mt-3 ${activeColor(index)} `}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={goToPreviousStep} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" disabled={currentStep === 0}>
          Previous Step
        </button>
        <button onClick={goToNextStep} className={`px-4 py-2 text-sm font-medium text-white rounded-md ${currentStep === numberOfSteps - 1 ? "bg-green-500" : "bg-blue-500"}`}>
          {currentStep === numberOfSteps - 1 ? "Complete Order" : "Next Step"}
        </button>
      </div>
    </div>
  );
}
