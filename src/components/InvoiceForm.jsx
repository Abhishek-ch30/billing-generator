import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, FileText, ArrowRight } from 'lucide-react';
import TemplatePreview from './TemplatePreview';

const InvoiceForm = ({ formData, onFormDataChange, selectedTemplate, setSelectedTemplate }) => {
  const handleInputChange = (field, value, section = null) => {
    if (section) {
      onFormDataChange({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      onFormDataChange({
        ...formData,
        [field]: value
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Calculate total for the item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    
    onFormDataChange({
      ...formData,
      items: newItems
    });
  };

  const addItem = () => {
    onFormDataChange({
      ...formData,
      items: [
        ...formData.items,
        {
          description: '',
          quantity: 1,
          rate: 0,
          total: 0
        }
      ]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    onFormDataChange({
      ...formData,
      items: newItems
    });
  };

  const templates = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Your Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Your Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.yourCompany?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value, 'yourCompany')}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              id="companyAddress"
              value={formData.yourCompany?.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value, 'yourCompany')}
              placeholder="Enter company address"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.yourCompany?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value, 'yourCompany')}
                placeholder="company@example.com"
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                value={formData.yourCompany?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value, 'yourCompany')}
                placeholder="+91 12345 67890"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bill To Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="billToName">Client Name</Label>
            <Input
              id="billToName"
              value={formData.billTo?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value, 'billTo')}
              placeholder="Enter client name"
            />
          </div>
          <div>
            <Label htmlFor="billToAddress">Address</Label>
            <Textarea
              id="billToAddress"
              value={formData.billTo?.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value, 'billTo')}
              placeholder="Enter client address"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billToEmail">Email</Label>
              <Input
                id="billToEmail"
                type="email"
                value={formData.billTo?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value, 'billTo')}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label htmlFor="billToPhone">Phone</Label>
              <Input
                id="billToPhone"
                value={formData.billTo?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value, 'billTo')}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoice?.number || ''}
                onChange={(e) => handleInputChange('number', e.target.value, 'invoice')}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoice?.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value, 'invoice')}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
            <Input
              id="taxPercentage"
              type="number"
              value={formData.taxPercentage || 0}
              onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
              placeholder="18"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Items
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.items?.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end mb-4 p-4 border rounded-lg">
              <div className="col-span-4">
                <Label>Description</Label>
                <Input
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity || 1}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
              <div className="col-span-2">
                <Label>Rate</Label>
                <Input
                  type="number"
                  value={item.rate || 0}
                  onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={item.total || 0}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="col-span-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
