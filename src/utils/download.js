function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function generatePDF(data) {
  const { jsPDF } = window.jspdf; // Ensure jsPDF is available globally
  const doc = new jsPDF();


  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Purchase Receipt", 105, 20, { align: "center" });

  // Transaction Info Box
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(60, 60, 150);
  doc.setFillColor(240, 240, 255);
  doc.rect(15, 30, 180, 20, "FD");
  doc.text(`Transaction ID: ${data.transaction_id}`, 20, 40);
  doc.text(`Date: ${formatDate(data.timestamp)}`, 20, 48);

  // Items Box
  let y = 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Items Purchased", 20, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let total = 0;

  data.items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    doc.setFillColor(250, 250, 255);
    doc.rect(15, y - 5, 180, 28, "F");

    doc.text(`#${index + 1}: ${item.title}`, 20, y);
    doc.text(`Category: ${item.categories}`, 20, y + 6);
    doc.text(`Price: Rs. ${(item.price)}`, 20, y + 12);
    doc.text(`Quantity: ${item.quantity}`, 20, y + 18);
    doc.text(`Subtotal: Rs. ${(subtotal)}`, 120, y + 18);

    y += 34;
  });

  // Total Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setFillColor(220, 220, 255);
  doc.rect(15, y, 180, 15, "F");
  doc.text(`TOTAL: Rs. ${(total)}`, 105, y + 10, {
    align: "center",
  });
  y += 30;

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Thanks for shopping with us!", 105, y, { align: "center" });

  // Save PDF
  doc.save("purchase_receipt.pdf");
}
// Create downloadable file
const handleDownload = (billItem) => {
    console.log("handleDownload called with:", billItem);
  const element = document.createElement("a");
  const file = new Blob([generatePDF(billItem)], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
};
export default handleDownload;
