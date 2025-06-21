
export const getIndianSampleData = () => {
  const companies = [
    {
      name: "Sharma Electronics Pvt Ltd",
      address: "123, MG Road, Connaught Place, New Delhi - 110001",
      phone: "+91 98765 43210",
      gst: "07AABCS1234C1Z5"
    },
    {
      name: "Mumbai Traders Co.",
      address: "45, Linking Road, Bandra West, Mumbai - 400050",
      phone: "+91 91234 56789",
      gst: "27AACCT1234D2Z6"
    },
    {
      name: "Bangalore Tech Solutions",
      address: "78, Brigade Road, Bangalore - 560001",
      phone: "+91 80123 45678",
      gst: "29AABCT1234E3Z7"
    },
    {
      name: "Chennai Textiles Ltd",
      address: "56, T Nagar, Chennai - 600017",
      phone: "+91 44987 65432",
      gst: "33AACCS1234F4Z8"
    }
  ];

  const customers = [
    {
      name: "Rajesh Kumar",
      address: "B-402, Hiranandani Gardens, Powai, Mumbai - 400076",
      phone: "+91 99887 76655"
    },
    {
      name: "Priya Sharma",
      address: "C-15, Lajpat Nagar, New Delhi - 110024",
      phone: "+91 98765 43221"
    },
    {
      name: "Amit Patel",
      address: "301, Bopal, Ahmedabad - 380058",
      phone: "+91 98234 56789"
    },
    {
      name: "Sneha Reddy",
      address: "12-3-456, Banjara Hills, Hyderabad - 500034",
      phone: "+91 90123 45678"
    }
  ];

  const items = [
    {
      name: "Samsung Galaxy M32",
      description: "128GB, 6GB RAM, Midnight Blue",
      quantity: 1,
      amount: 14999,
      total: 14999
    },
    {
      name: "Apple iPhone 13",
      description: "128GB, Starlight",
      quantity: 1,
      amount: 69900,
      total: 69900
    },
    {
      name: "OnePlus Nord CE 2",
      description: "128GB, Gray Mirror",
      quantity: 1,
      amount: 23999,
      total: 23999
    },
    {
      name: "Cotton Kurta Set",
      description: "Pure Cotton, Size L, Blue",
      quantity: 2,
      amount: 899,
      total: 1798
    },
    {
      name: "Basmati Rice",
      description: "Premium Quality, 5KG Pack",
      quantity: 2,
      amount: 450,
      total: 900
    },
    {
      name: "LED TV 43 inch",
      description: "Full HD, Smart TV, Black",
      quantity: 1,
      amount: 25999,
      total: 25999
    }
  ];

  const getRandomCompany = () => companies[Math.floor(Math.random() * companies.length)];
  const getRandomCustomer = () => customers[Math.floor(Math.random() * customers.length)];
  const getRandomItems = () => {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    for (let i = 0; i < numItems; i++) {
      selectedItems.push(items[Math.floor(Math.random() * items.length)]);
    }
    return selectedItems;
  };

  const today = new Date();
  const invoiceNumber = `INV${Math.floor(Math.random() * 9000) + 1000}`;

  return {
    yourCompany: getRandomCompany(),
    billTo: getRandomCustomer(),
    shipTo: getRandomCustomer(),
    invoice: {
      number: invoiceNumber,
      date: today.toISOString().split('T')[0],
      paymentDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    items: getRandomItems(),
    taxPercentage: 18,
    notes: "Thank you for your business! Payment due within 30 days.",
    selectedCurrency: "INR",
    cashier: "Ramesh Kumar"
  };
};
