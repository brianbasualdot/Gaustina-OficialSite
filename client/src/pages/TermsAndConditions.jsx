import React from 'react';
import SeoHead from '../components/common/SeoHead';

const TermsAndConditions = () => {
    return (
        <div className="bg-[#fefefc] min-h-screen pt-20">
            <SeoHead
                title="Términos y Condiciones | Gaustina"
                description="Lee los términos y condiciones de uso de nuestro sitio web Gaustina."
            />
            <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-12 text-center">
                    Términos y Condiciones
                </h1>

                <div className="prose prose-stone max-w-none text-gray-700 space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">1. General</h2>
                        <p>
                            Al acceder y utilizar este sitio web, aceptás los términos y condiciones aquí detallados. Gaustina se reserva el derecho de modificar estos términos en cualquier momento, entrando en vigencia desde su publicación en el sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">2. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido de este sitio, incluyendo textos, diseños, imágenes, logos y software, es propiedad de Gaustina o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual internacionales y de la República Argentina.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">3. Precios y Disponibilidad</h2>
                        <p>
                            Los precios están expresados en pesos argentinos e incluyen los impuestos correspondientes, a menos que se indique lo contrario. Nos reservamos el derecho de modificar los precios sin previo aviso. La disponibilidad de los productos puede variar y se confirmará al momento de la compra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">4. Envíos y Entregas</h2>
                        <p>
                            Los plazos de entrega son estimativos y pueden variar por razones ajenas a Gaustina. La responsabilidad sobre el producto se transfiere al cliente una vez entregado en la dirección proporcionada. Para más detalles, consultá nuestra <a href="/informacion-envios" className="text-brand-primary underline">Política de Envíos</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">5. Devoluciones</h2>
                        <p>
                            El cliente tiene derecho a solicitar cambios o devoluciones conforme a lo establecido en nuestra <a href="/politica-devoluciones" className="text-brand-primary underline">Política de Devoluciones</a>, cumpliendo con los plazos y condiciones allí indicados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">6. Limitación de Responsabilidad</h2>
                        <p>
                            Gaustina no será responsable por daños indirectos, incidentales o derivados del uso o la imposibilidad de uso de nuestro sitio web o productos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">7. Ley Aplicable</h2>
                        <p>
                            Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a los tribunales ordinarios de la ciudad de La Plata.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-500 italic">
                            Última actualización: Abril 2026.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
