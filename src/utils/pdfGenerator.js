
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveDocumentToSupabase } from './documentStorage';

export const generatePDF = async (invoiceData, templateNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invoice = document.createElement('div');
      document.body.appendChild(invoice);
      
      // Render the InvoiceTemplate component to a string
      const InvoiceTemplate = (await import('../components/InvoiceTemplate')).default;
      const ReactDOMServer = (await import('react-dom/server')).default;
      const React = (await import('react')).default;
      
      const invoiceElement = React.createElement(InvoiceTemplate, { data: invoiceData, templateNumber });
      const invoiceHTML = ReactDOMServer.renderToString(invoiceElement);
      
      invoice.innerHTML = invoiceHTML;
      invoice.style.width = '210mm';
      invoice.style.height = '297mm';
      
      const canvas = await html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      
      const { number, date } = invoiceData.invoice;
      const { name: companyName } = invoiceData.yourCompany;
      const { name: billToName } = invoiceData.billTo;
      const timestamp = new Date().getTime();

      let fileName;
      switch (templateNumber) {
        case 1:
          fileName = `${number}.pdf`;
          break;
        case 2:
          fileName = `${companyName}_${number}.pdf`;
          break;
        case 3:
          fileName = `${companyName}.pdf`;
          break;
        case 4:
          fileName = `${date}.pdf`;
          break;
        case 5:
          fileName = `${number}-${date}.pdf`;
          break;
        case 6:
          fileName = `invoice_${timestamp}.pdf`;
          break;
        case 7:
          fileName = `Invoice_${number}.pdf`;
          break;
        case 8:
          fileName = `Invoice_${billToName}.pdf`;
          break;
        case 9:
          fileName = `IN-${date}.pdf`;
          break;
        default:
          fileName = `invoice_template_${templateNumber}.pdf`;
      }

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      
      // Save to Supabase
      const saveResult = await saveDocumentToSupabase(pdfBlob, invoiceData, 'invoice', templateNumber);
      
      if (saveResult.success) {
        console.log('Document saved to Supabase:', saveResult.document);
        console.log('Public URL:', saveResult.publicUrl);
      } else {
        console.error('Failed to save document:', saveResult.error);
      }

      // Download the file
      pdf.save(fileName);
      
      document.body.removeChild(invoice);
      resolve(saveResult);
    } catch (error) {
      reject(error);
    }
  });
};
