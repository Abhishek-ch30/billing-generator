import React from 'react';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template2 = ({ data }) => {
  const { billTo, shipTo, invoice, yourCompany, items, taxPercentage, taxAmount, subTotal, grandTotal, notes, selectedCurrency } = data;

  const calculatedSubTotal = subTotal && !isNaN(subTotal) ? parseFloat(subTotal) : 
    items?.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + (quantity * rate);
    }, 0) || 0;

  const calculatedTaxAmount = taxAmount && !isNaN(taxAmount) ? parseFloat(taxAmount) : 
    (calculatedSubTotal * (parseFloat(taxPercentage) || 0) / 100);

  const calculatedGrandTotal = grandTotal && !isNaN(grandTotal) ? parseFloat(grandTotal) : 
    (calculatedSubTotal + calculatedTaxAmount);

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between mb-4 border-b-2 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-cyan-700">
              {yourCompany.name}
            </h1>
            <p>{yourCompany.address}</p>
            <p>{yourCompany.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-cyan-700">Tax invoice</h2>
            <p>INVOICE NUMBER: {invoice.number}</p>
            <p>DATE: {invoice.date}</p>
            <p>DUE DATE: {invoice.paymentDate}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-cyan-700">Bill To</h3>
            <p>{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-cyan-700">Ship To</h3>
            <p>{shipTo.name}</p>
            <p>{shipTo.address}</p>
            <p>{shipTo.phone}</p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="p-2 text-left border border-gray-300">ID</th>
                <th className="p-2 text-left border border-gray-300">
                  Description
                </th>
                <th className="p-2 text-right border border-gray-300">
                  Quantity
                </th>
                <th className="p-2 text-right border border-gray-300">Rate</th>
                <th className="p-2 text-right border border-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">{index + 1}</td>
                  <td className="p-2 border border-gray-300">
                    {item.name}
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency(parseFloat(item.rate) || 0, selectedCurrency)}
                  </td>
                  <td className="p-2 text-right border border-gray-300">
                    {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculatedSubTotal, selectedCurrency)}</span>
            </div>
            {taxPercentage > 0 && (
              <div className="flex justify-between mb-2">
                <span>Tax ({taxPercentage}%):</span>
                <span>{formatCurrency(calculatedTaxAmount, selectedCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(calculatedGrandTotal, selectedCurrency)}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-8 text-sm">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p>{notes}</p>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default Template2;
