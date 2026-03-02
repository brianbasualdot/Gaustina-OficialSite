import PDFDocument from 'pdfkit';
import axios from 'axios';

const SELLER_DATA = {
    name: "Agustina berth",
    cuit: "27-40735120-2",
    address: "Calle 4 1325",
    phone: "5492215791290",
    email: "bgaustina@gmail.com"
};

const LOGO_URL = "https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/logoinicio.png";

async function fetchImage(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("Error fetching image for PDF:", error);
        return null;
    }
}

export async function generateInvoicePDF(order) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const logoBuffer = await fetchImage(LOGO_URL);

    await generateHeader(doc, logoBuffer, order);
    generateSellerCustomerInfo(doc, order);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    return doc;
}

async function generateHeader(doc, logoBuffer, order) {
    if (logoBuffer) {
        doc.image(logoBuffer, 50, 45, { width: 120 });
    } else {
        doc.fontSize(20).font("Helvetica-Bold").text("GAUSTINA", 50, 45);
    }

    doc
        .fillColor("#444444")
        .fontSize(25)
        .font("Helvetica-Bold")
        .text("Orden de Compra", 200, 50, { align: "right" })
        .fontSize(10)
        .font("Helvetica")
        .text(`Fecha: ${new Date(order.createdAt).toLocaleDateString()}`, 200, 80, { align: "right" })
        .text(`Nº de orden: ${String(order.id).padStart(5, '0')}`, 200, 95, { align: "right" })
        .moveDown();

    generateHr(doc, 125);
}

function generateSellerCustomerInfo(doc, order) {
    const top = 140;

    // Seller Info
    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Datos del proveedor", 50, top)
        .fontSize(10)
        .font("Helvetica")
        .text(`Nombre: ${SELLER_DATA.name}`, 50, top + 20)
        .text(`CUIT: ${SELLER_DATA.cuit}`, 50, top + 35)
        .text(`Dirección: ${SELLER_DATA.address}`, 50, top + 50)
        .text(`Teléfono: ${SELLER_DATA.phone}`, 50, top + 65)
        .text(`Correo: ${SELLER_DATA.email}`, 50, top + 80);

    // Customer Info
    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Datos del cliente", 300, top)
        .fontSize(10)
        .font("Helvetica")
        .text(`Nombre: ${order.customerName || 'Cliente'}`, 300, top + 20)
        .text(`Email: ${order.customerEmail}`, 300, top + 35)
        .text(`Dirección: ${order.shippingAddress || 'N/A'}`, 300, top + 50)
        .text(`Ciudad: ${order.shippingCity || 'N/A'}`, 300, top + 65)
        .text(`Teléfono: ${order.shippingPhone || 'N/A'}`, 300, top + 80);

    generateHr(doc, 240);
}

function generateInvoiceTable(doc, order) {
    let i;
    const tableTop = 270;

    doc.font("Helvetica-Bold");
    generateTableRow(doc, tableTop, "Ref.", "Descripción", "Cantidad", "P. Unitario", "P. Total");
    generateHr(doc, tableTop + 20);
    doc.font("Helvetica");

    let currentY = tableTop + 30;

    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const description = item.product?.name || "Producto";
        const unitPrice = item.price;
        const quantity = item.quantity;
        const total = unitPrice * quantity;

        generateTableRow(
            doc,
            currentY,
            `#${String(item.productId).padStart(3, '0')}`,
            description,
            quantity,
            `$${unitPrice.toLocaleString('es-AR')}`,
            `$${total.toLocaleString('es-AR')}`
        );

        // Si hay personalización, la ponemos abajo
        if (item.selectedCustomizations) {
            const cuts = [];
            if (item.selectedCustomizations.fabricColor) cuts.push(`Tela: ${item.selectedCustomizations.fabricColor}`);
            if (item.selectedCustomizations.embroideryColor) cuts.push(`Bordado: ${item.selectedCustomizations.embroideryColor}`);
            if (item.selectedCustomizations.initials) cuts.push(`Iniciales: ${item.selectedCustomizations.initials}`);

            if (cuts.length > 0) {
                currentY += 15;
                doc.fontSize(8).fillColor("#777777").text(cuts.join(" | "), 100, currentY);
                doc.fontSize(10).fillColor("#000000"); // Restaurar
            }
        }

        currentY += 25;
        generateHr(doc, currentY - 5);
    }

    // Totales
    const summaryTop = currentY + 10;

    doc.font("Helvetica-Bold");

    // Subtotal
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    generateSummaryRow(doc, summaryTop, "Subtotal", `$${subtotal.toLocaleString('es-AR')}`);

    // Descuento (Si aplica, por ejemplo transferencia)
    if (order.totalAmount < subtotal) {
        const discount = subtotal - order.totalAmount;
        generateSummaryRow(doc, summaryTop + 20, "Descuento", `-$${discount.toLocaleString('es-AR')}`);
    }

    // Total a pagar
    doc.fontSize(12);
    generateSummaryRow(doc, summaryTop + 45, "Total a pagar", `$${Number(order.totalAmount).toLocaleString('es-AR')}`);
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .font("Helvetica-Oblique")
        .fillColor("#777777")
        .text(
            "Cualquier duda sobre tu pedido, contáctanos por WhatsApp o Instagram.",
            50,
            750,
            { align: "center", width: 500 }
        )
        .text(
            "Gracias por elegir Gaustina.",
            50,
            765,
            { align: "center", width: 500 }
        );
}

function generateTableRow(doc, y, ref, desc, qty, unit, total) {
    doc
        .fontSize(10)
        .text(ref, 50, y)
        .text(desc, 100, y)
        .text(qty, 300, y, { width: 50, align: "center" })
        .text(unit, 350, y, { width: 100, align: "right" })
        .text(total, 0, y, { align: "right" });
}

function generateSummaryRow(doc, y, label, value) {
    doc
        .text(label, 350, y, { width: 100, align: "right" })
        .text(value, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#eeeeee")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
