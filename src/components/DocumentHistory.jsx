
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Receipt, Calendar, User } from 'lucide-react';
import { getDocumentHistory } from '../utils/documentStorage';
import { formatCurrency } from '../utils/formatCurrency';

const DocumentHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const result = await getDocumentHistory();
    if (result.success) {
      setDocuments(result.documents);
    }
    setLoading(false);
  };

  const handleDownload = (document) => {
    const link = document.createElement('a');
    link.href = `https://hqiyhhongzkplaxndvgq.supabase.co/storage/v1/object/public/documents/${document.file_path}`;
    link.download = document.file_name;
    link.click();
  };

  const calculateTotal = (documentData) => {
    if (documentData.items) {
      const subtotal = documentData.items.reduce((sum, item) => sum + (item.total || 0), 0);
      const tax = subtotal * (documentData.taxPercentage || 0) / 100;
      return subtotal + tax;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Document History</h2>
        <Button onClick={fetchDocuments} variant="outline">
          Refresh
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <p>No documents generated yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {doc.document_type === 'invoice' ? (
                    <FileText className="h-8 w-8 text-blue-500" />
                  ) : (
                    <Receipt className="h-8 w-8 text-green-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-lg">
                      {doc.document_type === 'invoice' ? 'Invoice' : 'Receipt'} - {doc.document_data.invoice?.number}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {doc.document_data.yourCompany?.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(doc.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(calculateTotal(doc.document_data), doc.document_data.selectedCurrency || 'INR')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(doc)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentHistory;
