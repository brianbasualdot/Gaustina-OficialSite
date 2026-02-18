import PDFDocument from 'pdfkit';

export function generateInvoicePDF(order) {
    const doc = new PDFDocument({ margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, order);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    return doc;
}

function generateHeader(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("BDB - Biblioteca de Bordados", 50, 57)
        .fontSize(10)
        .text("BDB", 200, 50, { align: "right" })
        .text("Buenos Aires, Argentina", 200, 65, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, order) {
    const customerName = order.user?.name || order.customerName || 'Cliente Invitado';
    const customerEmail = order.user?.email || order.customerEmail || 'N/A';

    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Factura", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Orden Nro:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(order.id.slice(0, 8), 150, customerInformationTop)
        .font("Helvetica")
        .text("Fecha:", 50, customerInformationTop + 15)
        .text(new Date(order.createdAt).toLocaleDateString(), 150, customerInformationTop + 15)
        .text("Monto Total:", 50, customerInformationTop + 30)
        .text(`$${Number(order.total).toLocaleString('es-AR')}`, 150, customerInformationTop + 30)

        .font("Helvetica-Bold")
        .text(customerName, 300, customerInformationTop)
        .font("Helvetica")
        .text(customerEmail, 300, customerInformationTop + 15)
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Descripción",
        "Precio Unit.",
        "Cantidad",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            i + 1,
            item.product.name,
            `$${Number(item.price).toLocaleString('es-AR')}`,
            item.quantity,
            `$${(item.price * item.quantity).toLocaleString('es-AR')}`
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        "",
        `$${Number(order.total).toLocaleString('es-AR')}`
    );
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Gracias por tu compra. BDB.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
