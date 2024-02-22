// client/src/components/InvoiceGenerator.js

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";

// React component

const InvoiceGenerator = () => {
  const handleGenerateInvoice = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/generateinvoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add any additional headers if needed
        // body: JSON.stringify({ /* Any data you want to send to the server */ }),
      });

      if (response.ok) {
        // Convert the response to a blob
        const pdfBlob = await response.blob();

        // Create a Blob URL for the PDF
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab or download it
        window.open(pdfUrl, "_blank");
      } else {
        console.error("Failed to generate invoice:", response.statusText);
      }
    } catch (error) {
      console.error("Error while generating invoice:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateInvoice}>Generate Invoice</button>
    </div>
  );
};

export default InvoiceGenerator;
