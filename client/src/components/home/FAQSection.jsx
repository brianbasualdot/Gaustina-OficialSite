import { useState } from 'react';
import { Plus, Minus, ArrowRight, Mail, Phone, ExternalLink } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            category: "Sobre nuestros Productos",
            questions: [
                {
                    q: "¿De qué material están hechos los productos?",
                    a: "Utilizamos Tusor 100% algodón de alta calidad. Es una tela pre-lavada, con arrugas naturales y muy resistente, ideal para el uso diario en el hogar."
                },
                {
                    q: "¿Los productos vienen bordados?",
                    a: "¡Sí! Cada pieza de Gaustina cuenta con bordados artesanales exclusivos, diseñados y realizados minuciosamente en nuestro taller."
                },
                {
                    q: "¿Hacen trabajos personalizados?",
                    a: "Podés elegir los colores de tela y bordado en los productos que lo permitan. Para pedidos especiales de eventos o regalos empresariales, contactanos por WhatsApp."
                }
            ]
        },
        {
            category: "Cuidados de las Piezas",
            questions: [
                {
                    q: "¿Cómo debo lavar mis productos de Tusor?",
                    a: "Recomendamos lavar a mano con agua fría o en lavarropas con programa delicado. No usar blanqueadores y secar a la sombra para preservar los colores y el bordado."
                },
                {
                    q: "¿Es necesario planchar el Tusor?",
                    a: "El Tusor se caracteriza por su apariencia rústica y arrugada. Si preferís plancharlo, recomendamos hacerlo cuando la prenda esté ligeramente húmeda."
                }
            ]
        },
        {
            category: "Envíos y Entregas",
            questions: [
                {
                    q: "¿Cuáles son las opciones de envío?",
                    a: "Ofrecemos envió gratis a sucursal de correo argentino en cualquier punto del país. Si preferís envió a tu domicilio lo podes seleccionar al finalizar la compra, este ultimo tiene un costo adicional de tarifa plana ($6190)."
                },
                {
                    q: "¿Cuánto tarda en llegar mi pedido?",
                    a: "Preparamos tu pedido dentro de las 24-48hs hábiles. El tiempo de viaje del correo suele ser de 3 a 6 días hábiles adicionales según la zona."
                },
                {
                    q: "¿Cómo realizo el seguimiento?",
                    a: "Una vez despachado, recibirás un email con tu Tracking ID para que puedas seguir el recorrido desde la web oficial del correo."
                }
            ]
        },
        {
            category: "Pagos y Confirmación",
            questions: [
                {
                    q: "¿Qué medios de pago aceptan?",
                    a: "Aceptamos Mercado Pago y Transferencia Bancaria (esta última cuenta con un 15% de descuento extra en toda tu compra)."
                },
                {
                    q: "¿Cómo confirmo mi pago por transferencia?",
                    a: "Es muy importante que nos envíes el comprobante por WhatsApp o Email dentro de las 48hs de realizada la compra para que podamos procesar tu pedido. Pasado ese tiempo, la orden se cancela automáticamente."
                }
            ]
        },
        {
            category: "Cambios y Devoluciones",
            questions: [
                {
                    q: "¿Puedo realizar un cambio?",
                    a: "Sí, para productos de catálogo estándar tenés 30 días corridos desde la recepción. El producto debe estar sin uso y con sus etiquetas originales."
                },
                {
                    q: "¿Qué es el derecho de arrepentimiento?",
                    a: "Si te arrepentís de tu compra (en productos no personalizados), tenés 10 días corridos para solicitar la devolución total del dinero gestionándolo por nuestros canales de contacto."
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
                            href="mailto:bgaustina@gmail.com"
                            className="bg-white text-brand-dark hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm font-medium"
                        >
                            <Mail size={18} />
                            bgaustina@gmail.com
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
