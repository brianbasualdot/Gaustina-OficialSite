import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

if (!resend) {
  console.warn("⚠️  RESEND_API_KEY is missing. Email service will be disabled.");
}
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Gaustina <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'bgaustina@gmail.com';

// --- HTML COMPONENTS ---

const getEmailHeader = () => `
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${process.env.FRONTEND_URL}/iconBDB.png" alt="Gaustina" style="width: 100px; height: auto; margin-bottom: 15px;" />
  </div>
`;

const getEmailFooter = () => `
  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
    <img src="${process.env.FRONTEND_URL}/iconBDB.png" alt="Gaustina" style="width: 50px; height: auto; opacity: 0.8;" />
    <p style="font-size: 12px; color: #aaa; margin-top: 10px;">
      Gaustina - Biblioteca de Bordados
    </p>
  </div>
`;

// --- HELPER FUNCTION ---

const sendEmail = async ({ to, subject, html, reply_to }) => {
  try {
    if (!resend) {
      console.error('Email Service is disabled (missing API Key)');
      return { success: false, error: 'Email service disabled' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      reply_to: reply_to || ADMIN_EMAIL
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Email Service Error:', err);
    return { success: false, error: err.message };
  }
};

// --- SERVICES ---

// 1. Order Confirmation (User)
export const sendOrderConfirmation = async (order) => {
  const subject = `Confirmación de Orden #${order.id.slice(0, 8)} | Gaustina`;

  const itemsHtml = order.items.map(item => {
    const productName = item.product ? item.product.name : 'Producto';
    const customizations = item.selectedCustomizations
      ? `<br><small style="color: #666;">${Object.values(item.selectedCustomizations).join(', ')}</small>`
      : '';

    return `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
           <strong>${item.quantity}x</strong> ${productName} - $${item.price}
           ${customizations}
        </div>
      `;
  }).join('');

  const html = `
    ${getEmailHeader()}
    <h1 style="color: #333; font-size: 20px;">¡Gracias por tu compra, ${order.customerName || 'Cliente'}!</h1>
    <p style="color: #555;">Recibimos tu orden correctamente y la estamos procesando.</p>
    
    <h3 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px;">Detalle del Pedido:</h3>
    ${itemsHtml}
    
    <p style="text-align: right; font-size: 18px;"><strong>Total: $${order.total}</strong></p>
    
    <h3 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px;">Datos de Envío:</h3>
    <p style="color: #555;">
      <strong>Dirección:</strong> ${order.shippingAddress || '-'}<br>
      <strong>Ciudad:</strong> ${order.shippingCity || '-'}<br>
      <strong>CP:</strong> ${order.shippingZip || '-'}<br>
      <strong>Tel:</strong> ${order.shippingPhone || '-'}
    </p>
    
    ${getEmailFooter()}
  `;

  return sendEmail({ to: order.customerEmail, subject, html });
};

// 2. New Order Notification (Admin)
export const sendAdminNewOrderNotification = async (order) => {
  const subject = `💰 Nueva Venta #${order.id.slice(0, 8)} - $${order.total}`;
  const html = `
    <h1>¡Nueva Venta!</h1>
    <p><strong>Cliente:</strong> ${order.customerName} (${order.customerEmail})</p>
    <p><strong>Total:</strong> $${order.total}</p>
    <p>Revisa el dashboard para más detalles.</p>
  `;
  return sendEmail({ to: ADMIN_EMAIL, subject, html });
};

// 3. Contact Form Confirmation (User)
export const sendContactEmail = async ({ name, email, message }) => {
  const subject = `¡Gracias por contactarnos! - Gaustina`;
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #333;">Hola ${name},</h2>
    <p style="color: #555;">Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
       <p style="margin: 0; font-style: italic; color: #555;">"${message}"</p>
    </div>
    
    <p style="color: #555;">Saludos,<br>El equipo de Gaustina</p>
    ${getEmailFooter()}
  `;
  return sendEmail({ to: email, subject, html });
};

// 4. Admin Reply to Contact Message (User)
export const sendAdminReplyEmail = async ({ to, name, originalMessage, replyMessage, templateType }) => {
  let subject = `Respuesta a tu consulta - Gaustina`;
  switch (templateType) {
    case 'RETURNS': subject = `Información sobre tu Devolución - Gaustina`; break;
    case 'THANKS': subject = `¡Gracias por contactarnos! - Gaustina`; break;
    case 'CONFIRMATION': subject = `Confirmación de Acción - Gaustina`; break;
  }

  const html = `
    ${getEmailHeader()}
    <h2 style="color: #333;">Hola ${name},</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.5;">${replyMessage}</p>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
    
    <p style="color: #888; font-size: 14px; margin-bottom: 5px;">Tu mensaje original:</p>
    <div style="background: #f5f5f5; padding: 10px; color: #777; font-size: 14px; border-radius: 4px;">
       ${originalMessage}
    </div>
    
    ${getEmailFooter()}
  `;

  return sendEmail({ to, subject, html });
};

// 5. Abandoned Cart Recovery
export const sendAbandonedCartEmail = async (order) => {
  const subject = `¿Olvidaste algo? Tu carrito te espera en Gaustina`;
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #333;">Hola ${order.user?.name || 'ahí'},</h2>
    <p style="color: #555;">Notamos que dejaste una orden pendiente en nuestra tienda.</p>
    <p>¡No te preocupes! Guardamos tu carrito para cuando quieras volver.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/checkout?orderId=${order.id}" 
         style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
         Retomar Compra
      </a>
    </div>

    ${getEmailFooter()}
  `;
  return sendEmail({ to: order.user?.email || order.customerEmail, subject, html });
};
