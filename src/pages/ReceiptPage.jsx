
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, FileText, RotateCw, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Receipt1 from "../components/templates/Receipt1";
import Receipt2 from "../components/templates/Receipt2";
import Receipt3 from "../components/templates/Receipt3";
import Receipt4 from "../components/templates/Receipt4";
import { formatCurrency } from "../utils/formatCurrency";
import { generateReceiptPDF } from "../utils/receiptPDFGenerator";
import { generateGSTNumber } from "../utils/invoiceCalculations";
import { getIndianSampleData } from "../utils/indianSampleData";
import FloatingLabelInput from "../components/FloatingLabelInput";
import ItemDetails from "../components/ItemDetails";

const generateRandomInvoiceNumber = () => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const footerOptions = [
  "Thank you for choosing us today! We hope your shopping experience was pleasant and seamless. Your satisfaction matters to us, and we look forward to serving you again soon. Keep this receipt for any returns or exchanges.",
  "Your purchase supports our community! We believe in giving back and working towards a better future. Thank you for being a part of our journey. We appreciate your trust and hope to see you again soon.",
  "We value your feedback! Help us improve by sharing your thoughts on the text message survey link. Your opinions help us serve you better and improve your shopping experience. Thank you for shopping with us!",
  "Did you know you can save more with our loyalty program? Ask about it on your next visit and earn points on every purchase. It's our way of saying thank you for being a loyal customer. See you next time!",
  "Need assistance with your purchase? We're here to help! Reach out to our customer support, or visit our website for more information. We're committed to providing you with the best service possible.",
  "Keep this receipt for returns or exchanges.",
  "Every purchase makes a difference! We are dedicated to eco-friendly practices and sustainability. Thank you for supporting a greener planet with us. Together, we can build a better tomorrow.",
  "Have a great day!",
  "Thank you for shopping with us today. Did you know you can return or exchange your items within 30 days with this receipt? We want to ensure that you're happy with your purchase, so don't hesitate to come back if you need assistance.",
  "Eco-friendly business. This receipt is recyclable.",
  "We hope you enjoyed your shopping experience! Remember, for every friend you refer, you can earn exclusive rewards. Visit www.example.com/refer for more details. We look forward to welcoming you back soon!",
  "Thank you for choosing us! We appreciate your business and look forward to serving you again. Keep this receipt for any future inquiries or returns.",
  "Your purchase supports local businesses and helps us continue our mission. Thank you for being a valued customer. We hope to see you again soon!",
  "We hope you had a great shopping experience today. If you have any feedback, please share it with us on our website. We are always here to assist you.",
  "Thank you for your visit! Remember, we offer exclusive discounts to returning customers. Check your email for special offers on your next purchase.",
  "Your satisfaction is our top priority. If you need any help or have questions about your purchase, don't hesitate to contact us. Have a great day!",
  "We love our customers! Thank you for supporting our business. Follow us on social media for updates on promotions and new products. See you next time!",
  "Every purchase counts! We are committed to making a positive impact, and your support helps us achieve our goals. Thank you for shopping with us today!",
  "We hope you found everything you needed. If not, please let us know so we can improve your experience. Your feedback helps us serve you better. Thank you!",
  "Thank you for visiting! Did you know you can save more with our rewards program? Ask about it during your next visit and start earning points today!",
  "We appreciate your trust in us. If you ever need assistance with your order, please visit our website or call customer service. We're here to help!",
];

const ReceiptPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const [billTo, setBillTo] = useState("");
  const [invoice, setInvoice] = useState({
    date: "",
    number: generateRandomInvoiceNumber(),
  });
  const [yourCompany, setYourCompany] = useState({
    name: "",
    address: "",
    phone: "",
    gst: "",
  });
  const [cashier, setCashier] = useState("");
  const [items, setItems] = useState([
    { name: "", description: "", quantity: 0, amount: 0, total: 0 },
  ]);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [theme, setTheme] = useState("Receipt1");
  const [notes, setNotes] = useState("");
  const [footer, setFooter] = useState("Thank you");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const refreshFooter = () => {
    const randomIndex = Math.floor(Math.random() * footerOptions.length);
    setFooter(footerOptions[randomIndex]);
  };

  useEffect(() => {
    // Load form data from localStorage or initialize with Indian sample data
    const savedFormData = localStorage.getItem("receiptFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || "");
      setInvoice(parsedData.invoice || { date: "", number: generateRandomInvoiceNumber() });
      setYourCompany(parsedData.yourCompany || { name: "", address: "", phone: "", gst: "" });
      setCashier(parsedData.cashier || "");
      setItems(parsedData.items || [{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
      setTaxPercentage(parsedData.taxPercentage || 0);
      setNotes(parsedData.notes || "");
      setFooter(parsedData.footer || "Thank you");
      setSelectedCurrency(parsedData.selectedCurrency || "INR");
    } else {
      // Initialize with Indian sample data
      const sampleData = getIndianSampleData();
      setBillTo(sampleData.billTo.name);
      setInvoice(sampleData.invoice);
      setYourCompany(sampleData.yourCompany);
      setCashier(sampleData.cashier);
      setItems(sampleData.items);
      setTaxPercentage(sampleData.taxPercentage);
      setSelectedCurrency(sampleData.selectedCurrency);
    }
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    const formData = {
      billTo,
      invoice,
      yourCompany,
      cashier,
      items,
      taxPercentage,
      notes,
      footer,
      selectedCurrency,
    };
    localStorage.setItem("receiptFormData", JSON.stringify(formData));
  }, [billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency]);

  const handleDownloadPDF = async () => {
    if (!isDownloading && receiptRef.current) {
      setIsDownloading(true);
      const receiptData = {
        billTo,
        invoice,
        yourCompany,
        cashier,
        items,
        taxPercentage,
        notes,
        footer,
        selectedCurrency,
      };
      try {
        await generateReceiptPDF(receiptRef.current, theme, receiptData);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "amount") {
      newItems[index].total = newItems[index].quantity * newItems[index].amount;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const calculateTaxAmount = () => {
    const subTotal = parseFloat(calculateSubTotal());
    return (subTotal * (taxPercentage / 100)).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const subTotal = parseFloat(calculateSubTotal());
    const taxAmount = parseFloat(calculateTaxAmount());
    return (subTotal + taxAmount).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center space-x-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Receipt Generator
              </h1>
              <p className="text-gray-600">Create professional receipts with Indian business data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                "Download Receipt PDF"
              )}
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Go to Home"
            >
              <Home size={20} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <form>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Company</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    id="yourCompanyName"
                    label="Name"
                    value={yourCompany.name}
                    onChange={handleInputChange(setYourCompany)}
                    name="name"
                  />
                  <FloatingLabelInput
                    id="yourCompanyPhone"
                    label="Phone"
                    value={yourCompany.phone}
                    onChange={handleInputChange(setYourCompany)}
                    name="phone"
                  />
                </div>
                <FloatingLabelInput
                  id="yourCompanyAddress"
                  label="Address"
                  value={yourCompany.address}
                  onChange={handleInputChange(setYourCompany)}
                  name="address"
                  className="mt-4"
                />
                <div className="relative mt-4">
                  <FloatingLabelInput
                    id="yourCompanyGST"
                    label="GST No."
                    value={yourCompany.gst}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 15);
                      handleInputChange(setYourCompany)({
                        target: { name: "gst", value },
                      });
                    }}
                    name="gst"
                    maxLength={15}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGST = generateGSTNumber();
                      setYourCompany(prev => ({ ...prev, gst: newGST }));
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                    title="Generate new GST number"
                  >
                    <RotateCw size={16} />
                  </button>
                </div>
                <FloatingLabelInput
                  id="cashier"
                  label="Cashier"
                  value={cashier}
                  onChange={(e) => setCashier(e.target.value)}
                  name="cashier"
                  className="mt-4"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bill To</h2>
                <FloatingLabelInput
                  id="billTo"
                  label="Bill To"
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                  name="billTo"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Invoice Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingLabelInput
                    id="invoiceNumber"
                    label="Invoice Number"
                    value={invoice.number}
                    onChange={handleInputChange(setInvoice)}
                    name="number"
                  />
                  <FloatingLabelInput
                    id="invoiceDate"
                    label="Invoice Date"
                    type="date"
                    value={invoice.date}
                    onChange={handleInputChange(setInvoice)}
                    name="date"
                  />
                </div>
              </div>

              <ItemDetails
                items={items}
                handleItemChange={handleItemChange}
                addItem={addItem}
                removeItem={removeItem}
              />

              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Totals</h3>
                <div className="flex justify-between mb-2">
                  <span>Sub Total:</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(calculateSubTotal()), selectedCurrency)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax (%):</span>
                  <input
                    type="number"
                    value={taxPercentage}
                    onChange={(e) =>
                      setTaxPercentage(parseFloat(e.target.value) || 0)
                    }
                    className="w-24 p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="28"
                    step="1"
                  />
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax Amount:</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(calculateTaxAmount()), selectedCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span className="text-purple-600">{formatCurrency(parseFloat(calculateGrandTotal()), selectedCurrency)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Add any additional notes here..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">Footer</h3>
                  <button
                    type="button"
                    onClick={refreshFooter}
                    className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    title="Refresh footer"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <textarea
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="2"
                  placeholder="Thank you message..."
                ></textarea>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Receipt Preview</h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Receipt Style</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <label key={num} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="theme"
                      value={`Receipt${num}`}
                      checked={theme === `Receipt${num}`}
                      onChange={() => setTheme(`Receipt${num}`)}
                      className="mr-3"
                    />
                    <span className="font-medium">Receipt {num}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div ref={receiptRef} className="w-[380px] mx-auto border shadow-xl rounded-lg overflow-hidden">
              {theme === "Receipt1" && (
                <Receipt1
                  data={{
                    billTo,
                    invoice,
                    yourCompany,
                    cashier,
                    items,
                    taxPercentage,
                    notes,
                    footer,
                    selectedCurrency,
                  }}
                />
              )}
              {theme === "Receipt2" && (
                <Receipt2
                  data={{
                    billTo,
                    invoice,
                    yourCompany,
                    cashier,
                    items,
                    taxPercentage,
                    notes,
                    footer,
                    selectedCurrency,
                  }}
                />
              )}
              {theme === "Receipt3" && (
                <Receipt3
                  data={{
                    billTo,
                    invoice,
                    yourCompany,
                    cashier,
                    items,
                    taxPercentage,
                    notes,
                    footer,
                    selectedCurrency,
                  }}
                />
              )}
              {theme === "Receipt4" && (
                <Receipt4
                  data={{
                    billTo,
                    invoice,
                    yourCompany,
                    items,
                    taxPercentage,
                    footer,
                    cashier,
                    selectedCurrency,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
