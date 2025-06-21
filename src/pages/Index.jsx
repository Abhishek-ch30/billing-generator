import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Receipt, History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "../components/InvoiceForm";
import DocumentHistory from "../components/DocumentHistory";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { getIndianSampleData } from "../utils/indianSampleData";
import {
  calculateSubTotal,
  calculateTaxAmount,
  calculateGrandTotal,
} from "../utils/invoiceCalculations";
import { generatePDF } from "../utils/pdfGenerator";
import { templates } from "../utils/templateRegistry";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const invoicePreviewRef = useRef(null);

  useEffect(() => {
    // Load form data from localStorage or initialize with Indian sample data
    const savedFormData = localStorage.getItem("formData");
    let initialData;

    if (savedFormData) {
      initialData = JSON.parse(savedFormData);
    } else {
      // Always initialize with Indian sample data
      initialData = getIndianSampleData();
    }

    // Calculate totals
    const subTotal = calculateSubTotal(initialData.items);
    const taxAmount = calculateTaxAmount(
      subTotal,
      initialData.taxPercentage
    );
    const grandTotal = calculateGrandTotal(subTotal, taxAmount);

    const updatedFormData = {
      ...initialData,
      subTotal,
      taxAmount,
      grandTotal,
    };

    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  }, []);

  const handleFormDataChange = (newFormData) => {
    // Calculate totals
    const subTotal = calculateSubTotal(newFormData.items);
    const taxAmount = calculateTaxAmount(
      subTotal,
      newFormData.taxPercentage
    );
    const grandTotal = calculateGrandTotal(subTotal, taxAmount);

    const updatedFormData = {
      ...newFormData,
      subTotal,
      taxAmount,
      grandTotal,
    };

    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  };

  const handleGenerateInvoice = async () => {
    if (formData && !isGenerating) {
      setIsGenerating(true);
      try {
        await generatePDF(formData, selectedTemplate);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleGenerateReceipt = () => {
    navigate("/receipt");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Indian Business Ready
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Professional Invoice & Receipt Generator
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create beautiful, GST-compliant invoices and receipts in minutes. 
            Pre-loaded with Indian business data and multiple professional templates.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button
              onClick={() => document.querySelector('[role="tab"][value="invoice"]').click()}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              <span>Generate Invoice</span>
            </Button>
            
            <Button
              onClick={handleGenerateReceipt}
              variant="outline"
              className="flex items-center space-x-2 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Receipt className="h-5 w-5" />
              <span>Generate Receipt</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="invoice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="invoice" className="text-lg py-3">Invoice Generator</TabsTrigger>
            <TabsTrigger value="history" className="text-lg py-3">Document History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoice">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Form */}
              <div className="w-full lg:w-1/2">
                {formData && (
                  <InvoiceForm
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                  />
                )}
              </div>

              {/* Right Column: Preview and Actions */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
                    
                    {/* Template Selection */}
                    <div className="mb-4">
                      <p className="font-medium mb-2">Select Template</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {templates.map((template, index) => (
                          <Button
                            key={index}
                            variant={selectedTemplate === index + 1 ? "solid" : "outline"}
                            onClick={() => setSelectedTemplate(index + 1)}
                            className={`w-full ${selectedTemplate === index + 1 ? 'bg-blue-600 text-white' : ''}`}
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex justify-center" style={{ marginTop: '-12.5rem', marginBottom: '-7.5rem' }}>
                        <div ref={invoicePreviewRef} className="w-[210mm] h-[297mm] border shadow-lg overflow-hidden transform scale-[0.6]">
                        {formData && (
                            <InvoiceTemplate data={formData} templateNumber={selectedTemplate} />
                        )}
                        </div>
                    </div>

                    <Button
                      onClick={handleGenerateInvoice}
                      disabled={!formData || isGenerating}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                      <span>Download Invoice PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <DocumentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
