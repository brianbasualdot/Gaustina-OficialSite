import React from 'react';
import SeoHead from '../components/common/SeoHead';
import ProtectedImage from '../components/common/ProtectedImage';

const AboutPage = () => {
    return (
        <div className="bg-[#fefefc] min-h-screen">
            <SeoHead
                title="Quiénes Somos | Nuestro Taller en La Plata"
                description="Conocé la historia de Biblioteca de Bordados. Creamos lencería de mesa artesanal en nuestro taller de La Plata. Pasión por los detalles y el diseño textil."
            />
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <div className="relative aspect-[4/3] bg-[#FDFBF7] rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 pb-12 transition-transform hover:rotate-[-2deg] duration-500">
                        <div className="w-full h-full relative overflow-hidden shadow-inner bg-stone-200">
                            <ProtectedImage
                                src="https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/imagenabout.jpg"
                                alt="Manos artesanas bordando"
                                className="w-full h-full"
                                imgClassName="object-cover"
                            />
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                            En Biblioteca de Bordados no vendemos textiles; montamos la escenografía de tu vida.
                        </h1>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            Nacimos de una urgencia estética: la de recuperar esa nostalgia de las mesas de antes —donde cada detalle importaba y el tiempo se detenía— pero con un twist de colores vibrantes.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            Salimos del circuito de lo efímero para crear textiles que se quedan, que aguantan anécdotas, que cuentan una historia y que resisten el paso del tiempo. Creamos el marco perfecto para tus cenas de tres horas, tus brindis impulsivos y esos momentos donde la comida es la excusa, pero la mesa es la protagonista.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            En biblioteca de bordados vestimos mesas que celebran la autenticidad..
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
