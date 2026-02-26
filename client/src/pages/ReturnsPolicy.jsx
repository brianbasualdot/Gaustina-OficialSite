import React from 'react';
import { Download, Package, AlertCircle } from 'lucide-react';
import SeoHead from '../components/common/SeoHead';

const ReturnsPolicy = () => {
    return (
        <div className="pt-20">
            <SeoHead
                title="Política de Devoluciones | Gaustina"
                description="Conoce nuestras políticas de devolución para productos digitales y físicos."
            />
            <div className="bg-[#fefefc] min-h-screen py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-heading text-4xl text-brand-dark mb-12 text-center">
                        Cambios y Devoluciones
                    </h1>

                    <div className="space-y-12">
                        {/* Productos Digitales */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <Download size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    Productos Digitales (Diseños y Matrices)
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed">
                                <p>
                                    Debido a la naturaleza digital e irrevocable de nuestros archivos, <strong>no ofrecemos reembolsos ni devoluciones</strong> una vez que la compra ha sido completada y los archivos descargados.
                                </p>
                                <p className="mt-4">
                                    <strong>Excepción:</strong> Si el archivo presenta un error técnico comprobable o está dañado, contáctanos dentro de las 48hs y te enviaremos una versión corregida o un diseño de reemplazo de igual valor.
                                </p>
                            </div>
                        </section>

                        {/* Productos Físicos */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-brand-secondary/30 p-3 rounded-lg text-brand-dark">
                                    <Package size={24} />
                                </div>
                                <h2 className="font-heading text-2xl text-brand-dark">
                                    Productos Físicos (Insumos, Kits, Accesorios)
                                </h2>
                            </div>
                            <div className="prose prose-stone text-gray-600 leading-relaxed">
                                <p>
                                    Si compraste insumos o kits físicos, tienes <strong>10 días corridos</strong> desde que recibes el producto para solicitar un cambio o devolución.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>
                                        <strong>Condiciones:</strong> El producto debe estar sin uso, en su empaque original y en las mismas condiciones en que fue entregado.
                                    </li>
                                    <li>
                                        <strong>Productos defectuosos:</strong> Si el paquete llegó dañado por el correo, por favor toma fotos antes de abrirlo y contáctanos inmediatamente para gestionar el reclamo con la empresa de logística.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Contact info */}
                        <div className="flex gap-4 items-start bg-brand-accent/5 p-6 rounded-xl border border-brand-accent/10">
                            <AlertCircle className="text-brand-accent flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h3 className="font-bold text-brand-dark mb-1">¿Cómo gestionar un cambio?</h3>
                                <p className="text-sm text-gray-600">
                                    Escríbenos a <a href="mailto:bgaustina@gmail.com" className="text-brand-primary underline">bgaustina@gmail.com</a> con tu número de orden y el motivo. Te responderemos en 24hs hábiles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPolicy;
