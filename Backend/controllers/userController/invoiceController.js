const Order=require("../../models/Order");
const { productDetails } = require('./productController');
const PDFDocument = require('pdfkit');
const path = require('path');


// const generateInvoice=async (req, res) => {
//     try{
//         const { id } = req.query;
//         console.log("IIDD : ", id);
//         const order = await Order.findById(id)
//           .populate({
//             path: 'orderedItems.product',
//             model: 'ProductVariant',
//             select: 'name description',
//           });

//         console.log("order : ",order);
        
//         let data = {
//             //"documentTitle": "RECEIPT", //Defaults to INVOICE
//             //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
//             "currency": "USD", //See documentation 'Locales and Currency' for more info
//             "taxNotation": "vat", //or gst
//             "marginTop": 25,
//             "marginRight": 25,
//             "marginLeft": 25,
//             "marginBottom": 25,
//             "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
//             "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
//             "sender": {
//                 "company": "TeachTreasures",
//                 "address": "Kannur, Kerala , India",
//                 "zip": "670389",
//                 "city": "Kannur",
//                 "country": "India"
                
//             },
//             "client": {
//                    "company": "Client Corp",
//                    "address": "Clientstreet 456",
//                    "zip": "4567 CD",
//                    "city": "Clientcity",
//                    "country": "Clientcountry"
//                 //"custom1": "custom value 1",
//                 //"custom2": "custom value 2",
//                 //"custom3": "custom value 3"
//             },
//             "invoiceNumber": "2021.0001",
//             "invoiceDate": "1.1.2021",
//             "products":[{
//                 "quantity": "2",
//                 "description": "Test1",
//                 "tax": 6,
//                 "price": 33.87
//             },
//             {
//                 "quantity": "4",
//                 "description": "Test2",
//                 "tax": 21,
//                 "price": 10.45
//             }] ,
//             "bottomNotice": "Kindly pay your invoice within 15 days.",
//         }
        
//     //     order.orderedItems.map(item=>{
//     //         console.log("product : ",item);
//     //         return {   
//     //             quantity:item.quantity,
//     //             price:item.price,
//     //             name:item.name,
//     //             description:item.description
//     //         }
//     // })
//         const result = await easyinvoice.createInvoice(data);
//         const pdfBuffer = Buffer.from(result.pdf, 'base64');

//         // Set response headers
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//         res.setHeader('Content-Length', pdfBuffer.length);

//         // Send the PDF as an attachment
//         res.send(pdfBuffer);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//     }
// };

const generateInvoice = async (req, res) => {
    try {
        const invoiceData = {
            customer: {
                name: 'John Doe',
                address: '123 Main St, Cityville, USA',
            },
            items: [
                { description: 'Item 1', quantity: 2, price: 20 },
                { description: 'Item 2', quantity: 1, price: 30 },
            ],
            total: 70,
        };

        // Create PDF document
        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

        // Pipe the PDF to the response
        doc.pipe(res);

        // Customize the appearance of the PDF
        doc.font('Helvetica-Bold').fontSize(18).text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Customer: ${invoiceData.customer.name}`);
        doc.text(`Address: ${invoiceData.customer.address}`);
        doc.moveDown();

        // Table header
        doc.font('Helvetica-Bold');
        doc.text('Description', 100, doc.y);
        doc.text('Quantity', 300, doc.y);
        doc.text('Price', 400, doc.y);
        doc.moveDown();

        // Table rows
        doc.font('Helvetica');
        invoiceData.items.forEach((item) => {
            doc.text(item.description, 100, doc.y, { width: 150 });
            doc.text(item.quantity.toString(), 300, doc.y, { width: 100 });
            doc.text(`$${item.price.toFixed(2)}`, 400, doc.y, { width: 100 });
            doc.moveDown();
        });

        // Line separator
        doc.moveDown();
        doc.moveTo(100, doc.y).lineTo(500, doc.y).stroke();

        // Total
        doc.moveDown();
        doc.fontSize(14).text(`Total: $${invoiceData.total.toFixed(2)}`, { align: 'right' });

        // Thank you message
        doc.moveDown(2);
        doc.fontSize(12).text('Thank you for your business!', { align: 'center' });

        // Finalize the PDF and send to the client
        doc.end();
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports={
    generateInvoice
}