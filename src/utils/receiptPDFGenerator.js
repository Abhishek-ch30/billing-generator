
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveDocumentToSupabase } from './documentStorage';

export const generateReceiptPDF = async (receiptElement, theme, receiptData) => {
  try {
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [canvas.width * 0.264583, canvas.height * 0.264583],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.264583, canvas.height * 0.264583);

    const timestamp = new Date().getTime();
    const fileName = `Receipt_${receiptData.invoice?.number || timestamp}.pdf`;

    // Convert PDF to blob
    const pdfBlob = pdf.output('blob');
    
    // Save to Supabase
    const saveResult = await saveDocumentToSupabase(pdfBlob, receiptData, 'receipt', parseInt(theme.replace('Receipt', '')));
    
    if (saveResult.success) {
      console.log('Receipt saved to Supabase:', saveResult.document);
      console.log('Public URL:', saveResult.publicUrl);
    } else {
      console.error('Failed to save receipt:', saveResult.error);
    }

    // Download the file
    pdf.save(fileName);
    
    return saveResult;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
