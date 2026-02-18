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
                        Información de Envíos y Entregas
                    </h1>

                    <div className="space-y-12">
                        {/* Entrega Digital */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <Clock size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    1. Entrega de Archivos Digitales
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed">
                                <p>
                                    <strong>La entrega es inmediata.</strong>
                                </p>
                                <p className="mt-2">
                                    Una vez acreditado el pago, recibirás un correo electrónico con los enlaces de descarga.

                                </p>
                                <div className="mt-4 flex gap-3 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                                    <span>⚠️</span>
                                    <p><strong>Nota:</strong> Revisa siempre tu carpeta de Spam o Correo No Deseado.</p>
                                </div>
                            </div>
                        </section>

                        {/* Envío Físico */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <Truck size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    2. Envío de Productos Físicos
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed space-y-4">
                                <p>Realizamos envíos a todo el país (Argentina).</p>
                                <ul className="space-y-3">
                                    <li>
                                        <strong>Tiempos de Despacho:</strong> Preparamos tu pedido dentro de las 24-48 horas hábiles siguientes a la compra.
                                    </li>
                                    <li>
                                        <strong>Empresas de Correo:</strong> Trabajamos con Correo Argentino / Andreani.
                                    </li>
                                    <li>
                                        <strong>Seguimiento:</strong> En cuanto despachemos tu paquete, recibirás un código de seguimiento (Tracking ID) por email para que sepas dónde está tu pedido en todo momento.
                                    </li>
                                    <li>
                                        <strong>Costo:</strong> El costo se calcula automáticamente en el carrito ingresando tu Código Postal antes de pagar o si dice "Envio gratis" es que el envio es gratuito.
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
