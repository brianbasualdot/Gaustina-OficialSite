import React from 'react';
import SeoHead from '../components/common/SeoHead';

const PrivacyPolicy = () => {
    return (
        <div className="bg-[#fefefc] min-h-screen pt-20">
            <SeoHead
                title="Política de Privacidad | Gaustina"
                description="Conoce cómo protegemos y manejamos tus datos en Gaustina."
            />
            <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-12 text-center">
                    Política de Privacidad
                </h1>

                <div className="prose prose-stone max-w-none text-gray-700 space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. Recolección de Información</h2>
                        <p>
                            En Gaustina, valoramos tu privacidad. Recolectamos información personal que nos proporcionas directamente al realizar una compra, registrarte en nuestro sitio o contactarnos. Esto incluye nombre, dirección de correo electrónico, dirección de envío, número de teléfono y detalles del pedido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Uso de los Datos</h2>
                        <p>Utilizamos la información recolectada para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Procesar y enviar tus pedidos.</li>
                            <li>Comunicarnos con vos sobre el estado de tu compra.</li>
                            <li>Mejorar nuestra oferta de productos y servicios.</li>
                            <li>Enviarte novedades y promociones (solo si aceptás recibirlas).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Protección de la Información</h2>
                        <p>
                            Implementamos medidas de seguridad para proteger tus datos personales. Sin embargo, ninguna transmisión por Internet es 100% segura. Trabajamos con plataformas de pago seguras (como Mercado Pago) que garantizan el cifrado de tus datos financieros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Cookies</h2>
                        <p>
                            Nuestro sitio utiliza cookies para mejorar la experiencia del usuario, recordar tus preferencias y analizar el tráfico del sitio. Podés desactivar las cookies en la configuración de tu navegador, aunque esto podría afectar la funcionalidad del sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Compartir con Terceros</h2>
                        <p>
                            No vendemos ni alquilamos tus datos personales. Solo compartimos información necesaria con terceros que prestan servicios en nuestro nombre, como empresas de logística para el envío de productos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Tus Derechos</h2>
                        <p>
                            Tenés derecho a acceder, rectificar o solicitar la eliminación de tus datos personales en cualquier momento. Para hacerlo, podés contactarnos a <a href="mailto:bgaustina@gmail.com" className="text-brand-primary underline">bgaustina@gmail.com</a>.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-500 italic">
                            Última actualización: Abril 2026. Gaustina se reserva el derecho de modificar esta política en cualquier momento.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
