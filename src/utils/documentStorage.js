import { supabase } from '@/integrations/supabase/client';

export const saveDocumentToSupabase = async (pdfBlob, documentData, documentType, templateNumber) => {
  try {
    console.log('Starting document save process...');
    
    const timestamp = new Date().getTime();
    const fileName = `${documentType}_${documentData.invoice?.number || timestamp}_${timestamp}.pdf`;
    const filePath = `${documentType}s/${fileName}`;

    console.log('Uploading file:', fileName);
    console.log('File size:', pdfBlob.size);

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully:', uploadData);

    // Save document metadata to database
    const { data: documentRecord, error: dbError } = await supabase
      .from('documents')
      .insert({
        document_type: documentType,
        file_name: fileName,
        file_path: filePath,
        file_size: pdfBlob.size,
        mime_type: 'application/pdf',
        template_number: templateNumber,
        document_data: documentData,
        user_id: null // Allow anonymous users for now
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Document record saved:', documentRecord);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      success: true,
      document: documentRecord,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error('Error saving document:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getDocumentHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { success: true, documents: data };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: error.message };
  }
};
