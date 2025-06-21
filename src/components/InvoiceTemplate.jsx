import React from 'react';
import { templates } from '../utils/templateRegistry';

const InvoiceTemplate = ({ data, templateNumber }) => {
  const SelectedTemplate = templates[templateNumber - 1]?.component;

  if (!SelectedTemplate) {
    return <div>Template not found</div>;
  }

  return (
    // <div className="p-4 bg-transparent">
      <SelectedTemplate data={data} />
    // </div>
  );
};

export default InvoiceTemplate;
