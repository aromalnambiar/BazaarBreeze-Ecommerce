const CsvParser=require('json2csv').Parser;
const User=require('../../models/User');
const excelJs=require('exceljs');
const jsPDF = require('jspdf');

const exportCSV = async (req, res) => {
    try {
        // Assuming the frontend sends data with structure like: { reports: [...] }
        const { reports } = req.body;

        // Transform reports data to match the CSV format
        const csvData = reports.map((value, idx) => ({
            no: idx + 1,
            date: value.date,  // Replace with the actual property from your User model
            orders: value.orders,  // Replace with the actual property from your User model
            revenue: value.revenue,  // Replace with the actual property from your User model
            cancelled_orders: value.cancelled_orders,  // Replace with the actual property from your User model
        }));

        const csvFields = ['no', 'date', 'orders', 'revenue', 'cancelled_orders'];
        const csvParser = new CsvParser({ csvFields });
        const csvContent = csvParser.parse(csvData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment: filename=usersData.csv");
        res.status(200).end(csvContent);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const exportExcel = async (req, res) => {
    try {
        const {reports}=req.body;
        console.log("Excel : ",req.body);
        let workbook = new excelJs.Workbook();
        const sheet = workbook.addWorksheet("books");
        sheet.columns = [
            { header: "no", key: "no", width: 10 },
            { header: "date", key: "date", width: 25 },
            { header: "orders", key: "orders", width: 25 },
            { header: "revenue", key: "revenue", width: 25 },
            { header: "cancelled_orders", key: "cancelled_orders", width: 25 },
        ];

   

        await reports.map((value, idx) => {
            sheet.addRow({
                no: idx + 1,  // Assuming you want a sequential number as "no"
                date: value.date,  // Replace with the actual property from your User model
                orders: value.orders,  // Replace with the actual property from your User model
                revenue: value.revenue,  // Replace with the actual property from your User model
                cancelled_orders: value.cancelled_orders,  // Replace with the actual property from your User model
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=" + "salesReport.xlsx"
        );
        workbook.xlsx.write(res);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const exportPDF=async(req,res)=>{
    try {
        // Example JSON data
        const jsonData = [
          { name: 'John Doe', age: 30, city: 'New York' },
          { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
          // Add more data as needed
        ];
    
        // Create a new PDF document
        const pdfDoc = new jsPDF();
    
        // Set document properties
        pdfDoc.setProperties({
          title: 'Exported Data',
        });
    
        // Set font size and style
        pdfDoc.setFontSize(12);
    
        // Set table header
        const headers = Object.keys(jsonData[0]);
        const tableData = jsonData.map(obj => headers.map(key => obj[key]));
    
        pdfDoc.text('Exported Data', 14, 15);
        pdfDoc.autoTable({
          head: [headers],
          body: tableData,
        });
    
        // Save the PDF or send it to the client
        const pdfFileName = 'exported_data.pdf';
        pdfDoc.save(pdfFileName);
    
        // Alternatively, send the PDF as a response to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`);
        pdfDoc.output('arraybuffer').then((data) => res.send(data));
    
        console.log('PDF created successfully');
      } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports={
    exportCSV,
    exportExcel,
    exportPDF
}