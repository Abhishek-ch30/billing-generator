import React from 'react';
import InvoiceTemplate from './InvoiceTemplate';

const TemplatePreview = ({ templateNumber, formData }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute transform origin-top-left bg-white"
        style={{
          width: '210mm',
          height: '297mm',
          transform: 'scale(calc(126 / 816))', // A4 aspect ratio
        }}
      >
        <InvoiceTemplate data={formData} templateNumber={templateNumber} />
      </div>
    </div>
  );
};

export default TemplatePreview;
