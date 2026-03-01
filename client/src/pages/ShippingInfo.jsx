import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import SeoHead from '../components/common/SeoHead';

const ShippingInfo = () => {
    return (
        <div className="pt-20">
            <SeoHead
                title="Información de Envíos | Gaustina"
                description="Detalles sobre nuestros tiempos y métodos de envío a todo el país."
            />
            <div className="bg-[#fefefc] min-h-screen py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-heading text-4xl text-brand-dark mb-12 text-center">
                        Información sobre Envíos
                    </h1>

                    <div className="space-y-8">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Queremos que recibas tus productos de la forma más cómoda y conveniente. Por eso, te ofrecemos las siguientes opciones:
                        </p>

                        {/* Opciones de Envío */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center text-center">
                                <div className="bg-green-100 p-4 rounded-full text-green-700 mb-6">
                                    <MapPin size={32} />
                                </div>
                                <h2 className="font-heading text-xl text-brand-dark mb-4">Envío GRATIS a Sucursal</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Si eliges retirar tu compra en cualquier sucursal de <strong>Correo Argentino</strong>, el costo de envío es bonificado al 100%.
                                </p>
                            </section>

                            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center text-center">
                                <div className="bg-brand-secondary/30 p-4 rounded-full text-brand-dark mb-6">
                                    <Truck size={32} />
                                </div>
                                <h2 className="font-heading text-xl text-brand-dark mb-4">Envío a Domicilio</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Si prefieres recibir el paquete en la puerta de tu casa, podrás seleccionar esta opción al finalizar tu compra. Este servicio cuenta con un costo fijo de <strong>$6.000</strong> a cualquier punto del país.
                                </p>
                            </section>
                        </div>

                        {/* Pago por Transferencia */}
                        <section className="bg-brand-primary text-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                                    <Clock size={24} />
                                </div>
                                <h2 className="font-heading text-2xl">Pago por Transferencia</h2>
                            </div>

                            <div className="space-y-6 opacity-95">
                                <p>Si seleccionas la opción de Transferencia Bancaria al finalizar tu compra, por favor sigue estos pasos para agilizar tu envío:</p>

                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                        <p><strong>Envíanos el comprobante:</strong> Una vez realizada la transferencia, adjunta el comprobante a nuestro <a href="https://api.whatsapp.com/send/?phone=5492215791290" target="_blank" className="underline font-bold">WhatsApp +549 2215791290</a> o correo electrónico <a href="mailto:bgaustina@gmail.com" className="underline font-bold">bgaustina@gmail.com</a>.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                        <p><strong>Procesamiento:</strong> Una vez recibido el comprobante, daremos inicio inmediato al proceso de empaquetado y despacho de tu pedido.</p>
                                    </li>
                                </ul>

                                <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-sm mt-6 italic">
                                    <p><strong>Nota:</strong> El pedido se mantendrá reservado por 48 horas. Si no recibimos el comprobante en ese plazo, la orden se cancelará automáticamente.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
