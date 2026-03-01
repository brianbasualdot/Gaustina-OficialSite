import React from 'react';
import { Download, Package, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/common/SeoHead';

const ReturnsPolicy = () => {
    return (
        <div className="pt-20">
            <SeoHead
                title="Política de Devoluciones | Gaustina"
                description="Conoce nuestras políticas de devolución y derecho de arrepentimiento para tus compras en Gaustina."
            />
            <div className="bg-[#fefefc] min-h-screen py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-heading text-4xl text-brand-dark mb-12 text-center">
                        Políticas de Devolución
                    </h1>

                    <div className="space-y-8">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            En <strong>GAUSTINA</strong>, queremos que ames lo que compraste. Si algo no salió como esperabas, acá te explicamos cómo proceder:
                        </p>

                        {/* 1. Cambios */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <Package size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    1. Cambios de Productos Estándar
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed">
                                <p>
                                    Si compraste un producto de nuestro catálogo estándar tenés <strong>30 días corridos</strong> desde que recibiste tu compra para solicitar un cambio.
                                </p>
                                <div className="mt-4 bg-white/50 p-4 rounded-lg border border-gray-100 flex gap-3 text-sm italic">
                                    <AlertCircle size={18} className="flex-shrink-0 text-brand-primary" />
                                    <p><strong>Nota:</strong> El cambio queda sujeto a la disponibilidad de stock al momento de la solicitud. El producto debe estar sin uso, con etiquetas y en su empaque original.</p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Arrepentimiento */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <AlertCircle size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    2. Arrepentimiento
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed">
                                <p>
                                    Si te arrepentís de tu compra, tenés un plazo de <strong>10 días corridos</strong> desde la recepción del producto para solicitar la devolución total del dinero.
                                </p>
                                <p className="mt-4">
                                    Este derecho aplica exclusivamente para productos de catálogo que no hayan sido personalizados y se encuentren en las mismas condiciones en que fueron entregados.
                                </p>
                            </div>
                        </section>

                        {/* Contact info */}
                        <div className="bg-brand-primary text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl mb-4">¿Cómo gestionar el trámite?</h3>
                            <p className="mb-6 opacity-90">
                                Podés gestionarlo directamente a través de cualquiera de nuestros canales. Nos comunicaremos con vos a la brevedad:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <a
                                    href="https://api.whatsapp.com/send/?phone=5492215791290&text=Hola!%20Quisiera%20gestionar%20una%20devoluci%C3%B3n"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <span className="block font-bold">WhatsApp</span>
                                </a>
                                <a
                                    href="mailto:bgaustina@gmail.com"
                                    className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <span className="block font-bold">Gmail</span>
                                </a>
                                <Link
                                    to="/contacto"
                                    className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <span className="block font-bold">Contacto</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPolicy;
