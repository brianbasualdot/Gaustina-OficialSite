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
                    q: "¿De qué material están hechos los necesers y bolsos?",
                    a: "Están confeccionados con telas de alta calidad (como nuestra tela pre-lavada de arrugas naturales), elegidas por su resistencia y estética. Todos cuentan con forrería interna para darles mayor estructura y durabilidad."
                },
                {
                    q: "¿Puedo personalizar el bordado de mi neceser o bolso?",
                    a: "¡Sí! En los productos que lo permiten, podés personalizarlo eligiendo que bordemos tus iniciales o seleccionando colores de tela y bordado. Cada pieza es diseñada de forma exclusiva en nuestro taller."
                },
                {
                    q: "¿Dónde puedo ver las medidas de los productos?",
                    a: "Las medidas exactas de cada neceser y bolso están detalladas en la descripción de cada producto. ¡Están pensados para ser súper funcionales y que entre todo lo indispensable!"
                },
                {
                    q: "¿Hacen pedidos por mayor para eventos o regalos empresariales?",
                    a: "Sí, realizamos pedidos especiales por cantidad. Son ideales para regalos empresariales, souvenirs o eventos. Contactanos por WhatsApp para contarnos tu idea y recibir asesoramiento."
                }
            ]
        },
        {
            category: "Cuidados de las Piezas",
            questions: [
                {
                    q: "¿Cómo debo lavar mi neceser o bolso?",
                    a: "Para mantener la forma del producto y cuidar los detalles del bordado, recomendamos lavar a mano con agua fría y jabón neutro. En caso de usar lavarropas, asegurate de utilizar un programa muy delicado."
                },
                {
                    q: "¿Cómo es el secado y planchado?",
                    a: "Secalos siempre a la sombra y sin retorcer para preservar los colores y la estructura. Si preferís plancharlo, te sugerimos hacerlo del lado del revés, con la tela ligeramente húmeda y la plancha a temperatura tibia."
                }
            ]
        },
        {
            category: "Envíos y Entregas",
            questions: [
                {
                    q: "¿Cuáles son las opciones de envío?",
                    a: "Ofrecemos envío gratis a sucursal de Correo Argentino en cualquier punto del país. Si preferís el envío directamente a tu domicilio, lo podés seleccionar al finalizar la compra (esta última opción tiene un costo adicional)."
                },
                {
                    q: "¿Cuánto tarda en llegar mi pedido?",
                    a: "Como muchos de nuestros productos se bordan especialmente a pedido, solemos despachar en 24-48hs hábiles (o según el tiempo indicado de confección). Una vez en viaje, el correo suele demorar entre 3 a 7 días hábiles según la zona."
                },
                {
                    q: "¿Cómo realizo el seguimiento de mi paquete?",
                    a: "Una vez despachado el pedido, vas a recibir un email con tu Número de Seguimiento (Tracking ID) para que puedas seguir el recorrido desde la web oficial del correo."
                }
            ]
        },
        {
            category: "Pagos y Confirmación",
            questions: [
                {
                    q: "¿Qué medios de pago aceptan?",
                    a: "Aceptamos Mercado Pago y Transferencias Bancarias. ¡Recordá que abonando por transferencia tenés un 15% de descuento extra en toda tu compra!"
                },
                {
                    q: "¿Cómo confirmo mi pago por transferencia?",
                    a: "Es muy importante que nos envíes el comprobante por WhatsApp o Email dentro de las 48hs de realizada la compra para poder procesar tu pedido. Pasado ese tiempo sin confirmación, la orden se cancela automáticamente."
                }
            ]
        },
        {
            category: "Cambios y Devoluciones",
            questions: [
                {
                    q: "¿Puedo realizar un cambio o devolución?",
                    a: "Sí, para productos de catálogo estándar (no personalizados) tenés 30 días corridos desde que lo recibís para realizar cambios, y 10 días para devoluciones. El producto siempre debe estar sin uso y en sus condiciones originales."
                },
                {
                    q: "¿Tienen cambio los productos personalizados con iniciales?",
                    a: "Los productos que son personalizados especialmente para vos (por ejemplo, con el bordado de tus iniciales) no tienen cambio ni devolución, a menos que presenten alguna falla de fabricación."
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
