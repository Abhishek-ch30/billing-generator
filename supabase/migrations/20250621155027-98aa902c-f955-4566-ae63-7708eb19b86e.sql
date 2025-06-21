
-- Create a table to store generated documents (invoices and receipts)
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  document_type TEXT NOT NULL CHECK (document_type IN ('invoice', 'receipt')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  template_number INTEGER,
  document_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for document access
CREATE POLICY "Users can view their own documents" 
  ON public.documents 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own documents" 
  ON public.documents 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own documents" 
  ON public.documents 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Create storage policies
CREATE POLICY "Anyone can view documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'documents');

CREATE POLICY "Anyone can upload documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can update their own documents" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'documents');

CREATE POLICY "Users can delete their own documents" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'documents');
