import { useState } from 'react';
import { Plus, Minus, ArrowRight, Mail, Phone, ExternalLink } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            category: "Sobre los Archivos y Diseños",
            questions: [
                {
                    q: "¿En qué formato recibiré los diseños de bordado?",
                    a: "Nuestros diseños son compatibles con la gran mayoría de las máquinas. Recibirás un archivo .ZIP con los formatos: .PES, .DST, .JEF, .XXX, .EXP, .HUS, entre otros. Contáctanos si necesitas uno específico."
                },
                {
                    q: "¿Cómo recibo mi pedido? ¿Es inmediato?",
                    a: "¡Sí! Al ser productos digitales, recibes el enlace de descarga en tu correo automáticamente tras el pago."
                },
                {
                    q: "¿Qué tamaños tienen los diseños?",
                    a: "Cada diseño tiene sus medidas en la descripción. Verifica siempre el área de bordado de tu bastidor antes de comprar."
                },
                {
                    q: "¿Puedo cambiar el tamaño del diseño yo mismo/a?",
                    a: "No recomendamos redimensionar más de un 10-15% para no afectar la densidad de puntadas y la calidad del bordado."
                }
            ]
        },
        {
            category: "Licencias y Uso Comercial",
            questions: [
                {
                    q: "¿Puedo vender los productos que bordo con estos diseños?",
                    a: "¡Sí! Tienes total libertad para vender prendas o accesorios bordados con nuestros diseños en tu emprendimiento."
                },
                {
                    q: "¿Puedo compartir o revender el archivo digital?",
                    a: "No. La licencia es de uso personal e intransferible. Queda prohibida la reventa o distribución de los archivos digitales."
                }
            ]
        },
        {
            category: "Pagos y Envíos",
            questions: [
                {
                    q: "¿Qué medios de pago aceptan?",
                    a: "Aceptamos Mercado Pago (Tarjetas, Dinero en cuenta, Rapipago/PagoFácil) y Transferencia Bancaria."
                },
                {
                    q: "¿Ofrecen reembolsos?",
                    a: "Por ser productos digitales, no ofrecemos reembolsos una vez descargados, salvo error técnico comprobable del archivo."
                },
                {
                    q: "¿Cuánto tarda el envío de productos físicos?",
                    a: "Despachamos en 24-48hs hábiles. Los tiempos de correo varían según tu provincia (generalmente 3 a 6 días)."
                }
            ]
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-heading text-brand-dark text-center mb-12">
                    Preguntas Frecuentes
                </h2>

                <div className="space-y-12">
                    {faqData.map((section, catIndex) => (
                        <div key={catIndex}>
                            <h3 className="text-xl font-medium text-brand-dark mb-6 border-b border-gray-100 pb-2">
                                {section.category}
                            </h3>
                            <div className="space-y-4">
                                {section.questions.map((item, qIndex) => {
                                    const globalIndex = `${catIndex}-${qIndex}`;
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={qIndex}
                                            className="bg-white border boundary-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                                        >
                                            <button
                                                onClick={() => toggleQuestion(globalIndex)}
                                                className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                                            >
                                                <span className={`font-medium text-lg leading-snug transition-colors ${isOpen ? 'text-brand-primary' : 'text-gray-800'}`}>
                                                    {item.q}
                                                </span>
                                                <span className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : 'text-gray-400'}`}>
                                                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                                </span>
                                            </button>

                                            <div
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action Footer */}
                <div className="mt-20 bg-brand-secondary/30 rounded-2xl p-8 md:p-12 text-center border border-brand-secondary/50">
                    <h3 className="text-2xl font-heading text-brand-dark mb-4">
                        ¿Te quedó alguna duda sin resolver?
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Estamos aquí para ayudarte. Contáctanos directamente y te responderemos a la brevedad.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <a
                            href="mailto:bibliotecadebordados@gmail.com"
                            className="bg-white text-brand-dark hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm font-medium"
                        >
                            <Mail size={18} />
                            bibliotecadebordados@gmail.com
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=5492215791290&text&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm font-medium"
                        >
                            <Phone size={18} />
                            WhatsApp (Solo mensajes)
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
