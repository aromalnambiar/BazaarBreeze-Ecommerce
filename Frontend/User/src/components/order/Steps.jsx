import { useState } from "react";

export default () => {
  const [steps, setStep] = useState({
    stepsItems: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    currentStep: 2,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 mt-12 mb-8 md:px-0 border p-14 rounded-md shadow-lg">
      <ul aria-label="Steps" className="items-center w-[50vw] mx-auto text-gray-600 font-medium md:flex">
        {steps.stepsItems.map((item, idx) => (
          <li key={idx} aria-current={steps.currentStep == idx + 1 ? "step" : false} className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0">
            <div className="flex flex-col items-center md:flex-row md:flex-1">
              <hr className={`w-full border hidden md:block ${idx == 0 ? "border-none" : "" || steps.currentStep >= idx + 1 ? "border-[#FA8232]" : ""}`} />
              <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${steps.currentStep > idx + 1 ? "bg-[#FA8232] border-[#FA8232]" : "" || steps.currentStep == idx + 1 ? "border-[#FA8232]" : ""}`}>
                <span className={`w-2.5 h-2.5 rounded-full bg-[#FA8232] ${steps.currentStep != idx + 1 ? "hidden" : ""}`}></span>
                {steps.currentStep > idx + 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  ""
                )}
              </div>
              <hr className={`h-12 border md:w-full md:h-auto ${idx + 1 == steps.stepsItems.length ? "border-none" : "" || steps.currentStep > idx + 1 ? "border-[#FA8232]" : ""}`} />
            </div>
            <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
              <h3 className={`text-sm ${steps.currentStep == idx + 1 ? "text-[#FA8232]" : ""}`}>{item}</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
