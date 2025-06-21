import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template1 = ({ data }) => {
  const { billTo, shipTo, invoice, yourCompany, items, taxPercentage, taxAmount, subTotal, grandTotal, notes, selectedCurrency } = data;

  // Calculate values if not provided or if they're NaN
  const calculatedSubTotal = subTotal && !isNaN(subTotal) ? parseFloat(subTotal) : 
    items?.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const amount = parseFloat(item.amount) || 0;
      return sum + (quantity * amount);
    }, 0) || 0;

  const calculatedTaxAmount = taxAmount && !isNaN(taxAmount) ? parseFloat(taxAmount) : 
    (calculatedSubTotal * (parseFloat(taxPercentage) || 0) / 100);

  const calculatedGrandTotal = grandTotal && !isNaN(grandTotal) ? parseFloat(grandTotal) : 
    (calculatedSubTotal + calculatedTaxAmount);

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-6 w-full min-h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{yourCompany.name}</h1>
            <p className="text-sm">{yourCompany.address}</p>
            <p className="text-sm">{yourCompany.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
            <div className="text-sm space-y-1">
              <p><strong>Invoice Number:</strong> {invoice.number}</p>
              <p><strong>Invoice Date:</strong> {invoice.date}</p>
              <p><strong>Due Date:</strong> {invoice.paymentDate}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-1/2 pr-4">
            <h3 className="font-bold text-sm mb-2">Bill To:</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{billTo.name}</p>
              <p>{billTo.address}</p>
              <p>{billTo.phone}</p>
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="font-bold text-sm mb-2">Ship To:</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{shipTo.name}</p>
              <p>{shipTo.address}</p>
              <p>{shipTo.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-black">
                <th className="text-left py-2 pr-4 font-bold text-sm">Item</th>
                <th className="text-center py-2 px-4 font-bold text-sm">Quantity</th>
                <th className="text-right py-2 px-4 font-bold text-sm">Unit Price</th>
                <th className="text-right py-2 pl-4 font-bold text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                  </td>
                  <td className="text-center py-3 px-4 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-4 text-sm">
                    {formatCurrency(parseFloat(item.rate) || 0, selectedCurrency)}
                  </td>
                  <td className="text-right py-3 pl-4 text-sm">
                    {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-4">
          <div className="w-1/3 min-w-fit">
            <div className="space-y-2">
              <div className="flex justify-between py-1 text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculatedSubTotal, selectedCurrency)}</span>
              </div>
              {taxPercentage > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span>Tax ({taxPercentage}%):</span>
                  <span className="font-medium">{formatCurrency(calculatedTaxAmount, selectedCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-bold border-t border-gray-300">
                <span>Total:</span>
                <span>{formatCurrency(calculatedGrandTotal, selectedCurrency)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-sm mb-2">Notes:</h3>
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default Template1;