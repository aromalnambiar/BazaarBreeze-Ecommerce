import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PdfDownloadButton = ({ jsonData, fileName }) => {
  const handleDownload = () => {
    const pdf = new jsPDF();

    pdf.setProperties({
      title: fileName || "Downloaded PDF",
    });

    pdf.setFontSize(12);

    // Add a sequential "NO" column numbering from 1 to n for each row
    const tableData = jsonData.map((obj, index) => [index + 1, obj.productDetails.variantName, obj.price, obj.quantity, obj.quantity * obj.price]);

    const headers = ["NO", "NAME", "PRICE", "QUANTITY", "TOTAL"];

    pdf.text("Downloaded PDF", 14, 8);

    pdf.autoTable({
      head: [headers],
      body: tableData,
    });

    pdf.save(fileName || "downloaded_pdf.pdf");
  };

  return (
    <button className="text-sm hover:text-blue-500" onClick={handleDownload}>
      PDF
    </button>
  );
};

export default PdfDownloadButton;
