export const calculateSubTotal = (items) => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce((sum, item) => {
    // Handle different possible property names for amount/price
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.amount) || parseFloat(item.price) || parseFloat(item.unitPrice) || 0;
    const itemTotal = parseFloat(item.total) || (quantity * unitPrice);
    
    return sum + itemTotal;
  }, 0);
};

export const calculateTaxAmount = (subTotal, taxPercentage) => {
  const subTotalNum = parseFloat(subTotal) || 0;
  const taxPercent = parseFloat(taxPercentage) || 0;
  return (subTotalNum * (taxPercent / 100));
};

export const calculateGrandTotal = (subTotal, taxAmount) => {
  const subTotalNum = parseFloat(subTotal) || 0;
  const taxAmountNum = parseFloat(taxAmount) || 0;
  return subTotalNum + taxAmountNum;
};

// Helper function to calculate individual item total
export const calculateItemTotal = (quantity, unitPrice) => {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  return qty * price;
};

export const generateGSTNumber = () => {
  var stateCode = 22;
  var panNumber = generatePANNumber();
  var registrationCount = generateRegistrationCount();
  var checkCode = generateCheckCode();
  return stateCode + panNumber + registrationCount + "Z" + checkCode;
};

function generatePANNumber() {
  var panNumber = "";
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var taxpayerCategories = "ABCFGHLJPT";
  for (var i = 0; i < 3; i++) {
    panNumber += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  panNumber += taxpayerCategories.charAt(
    Math.floor(Math.random() * taxpayerCategories.length)
  );
  panNumber += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  for (var j = 0; j < 4; j++) {
    panNumber += Math.floor(Math.random() * 10);
  }
  panNumber += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return panNumber;
}

function generateRegistrationCount() {
  var registrationCount = Math.floor(Math.random() * 10);
  return registrationCount;
}

function generateCheckCode() {
  var checkCode = Math.floor(Math.random() * 10);
  return checkCode;
}