import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PdfDownloadButton = ({ jsonData, fileName, shippingAddress, orderDate, totalAmount }) => {
  const formatShippingAddress = () => {
    // Format the shipping address object
    const { street, phone1, phone2, state, address, fullName, pincode } = shippingAddress;
    return `Street: ${street}\nPhone 1: ${phone1}\nPhone 2: ${phone2}\nState: ${state} \nAddress: ${address}\nFullName: ${fullName}\nPinCode: ${pincode}`;
  };

  const handleDownload = () => {
    const pdf = new jsPDF();
  
    pdf.setProperties({
      title: fileName || "Downloaded PDF",
    });
  
    pdf.setFontSize(12);
  
    // Add shipping address and additional details
    pdf.text("Shipping Address:", 14, 20);
    pdf.text(formatShippingAddress(), 20, 30);
  
    // Set alignment to right for Order Date
    pdf.text(`Order Date: ${new Date(orderDate).toLocaleDateString()}`, pdf.internal.pageSize.width - 30, 30, { align: "right" });
  
    // Add a sequential "NO" column numbering from 1 to n for each row
    const tableData = jsonData.map((obj, index) => [index + 1, obj.productDetails.variantName, obj.price, obj.quantity, obj.quantity * obj.price]);
  
    const headers = ["NO", "NAME", "PRICE", "QUANTITY", "TOTAL"];
  
    // Add the table
    pdf.autoTable({
      head: [headers],
      body: tableData,
      startY: 80, // Set Y position for the table below shipping address and details
    });
  
    // Set alignment to right for Total Amount
    pdf.text(`Total Amount: ${totalAmount}`, pdf.internal.pageSize.width - 30, pdf.autoTable.previous.finalY + 10, { align: "right" });
  
    pdf.save(fileName || "downloaded_pdf.pdf");
  };
  

  return (
    <button className="text-sm hover:text-blue-500" onClick={handleDownload}>
      PDF
    </button>
  );
};

export default PdfDownloadButton;
