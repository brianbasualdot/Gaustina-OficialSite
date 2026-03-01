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
        .fillColor("#333333")
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("GAUSTINA", 50, 50)
        .fontSize(10)
        .font("Helvetica")
        .text("Hecho con amor.", 50, 75)
        .text("Buenos Aires, Argentina", 200, 50, { align: "right" })
        .text("bgaustina@gmail.com", 200, 65, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, order) {
    const customerName = order.customerName || 'Cliente Invitado';
    const customerEmail = order.customerEmail || 'N/A';

    doc
        .fillColor("#333333")
        .fontSize(20)
        .text("Factura de Compra", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Orden Nro:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(String(order.id).padStart(6, '0'), 150, customerInformationTop)
        .font("Helvetica")
        .text("Fecha:", 50, customerInformationTop + 15)
        .text(new Date(order.createdAt).toLocaleDateString(), 150, customerInformationTop + 15)
        .text("Monto Total:", 50, customerInformationTop + 30)
        .text(`$${Number(order.totalAmount).toLocaleString('es-AR')}`, 150, customerInformationTop + 30)

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
        const position = invoiceTableTop + (i + 1) * 45; // Aumentamos espacio para personalizaciones

        let description = item.product.name;
        if (item.selectedCustomizations) {
            const cuts = [];
            if (item.selectedCustomizations.fabricColor) cuts.push(`Tela: ${item.selectedCustomizations.fabricColor}`);
            if (item.selectedCustomizations.embroideryColor) cuts.push(`Bordado: ${item.selectedCustomizations.embroideryColor}`);
            if (item.selectedCustomizations.initials) cuts.push(`Iniciales: ${item.selectedCustomizations.initials} (${item.selectedCustomizations.initialsColor})`);

            if (cuts.length > 0) {
                // Dibujamos el nombre del producto
                doc.font("Helvetica-Bold").text(description, 150, position);
                // Dibujamos las personalizaciones abajo en fuente normal
                doc.font("Helvetica").fontSize(8).fillColor("#666666").text(cuts.join(" | "), 150, position + 12);
                doc.fontSize(10).fillColor("#333333"); // Restaurar
            } else {
                doc.text(description, 150, position);
            }
        } else {
            doc.text(description, 150, position);
        }

        generateTableRow(
            doc,
            position,
            i + 1,
            "", // La descripción ya la manejamos arriba
            `$${Number(item.price).toLocaleString('es-AR')}`,
            item.quantity,
            `$${(item.price * item.quantity).toLocaleString('es-AR')}`
        );

        generateHr(doc, position + 25);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 45 + 15;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        "",
        `$${Number(order.totalAmount).toLocaleString('es-AR')}`
    );
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
            "Gracias por elegir Gaustina. Esperamos que ames tus piezas tanto como nosotros amamos crearlas.",
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
