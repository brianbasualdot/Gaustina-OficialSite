import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <div className="relative aspect-auto md:aspect-[3/2] overflow-hidden">
                        <img
                            src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/about.bdb.png"
                            alt="Manos artesanas bordando"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>

                    {/* Text Column */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-script text-brand-primary mb-6">
                            Nuestra Esencia
                        </h1>

                        <p className="text-lg text-gray-700 font-body leading-relaxed">
                            En cada uno de nuestros individuales y posavasos reside una historia de tradición y paciencia. Utilizamos hilos de algodón 100% seleccionados cuidadosamente por su suavidad y resistencia, asegurando que cada pieza no solo vista tu mesa, sino que perdure en el tiempo como un objeto de afecto.
                        </p>

                        <p className="text-lg text-gray-700 font-body leading-relaxed">
                            Nuestras artesanas dedican horas de minuciosa labor en cada puntada, inspirándose en los tonos terrosos y las formas orgánicas de la flora local. Creemos que el lujo reside en los detalles imperfectos que hacen única a cada creación, alejándonos de la producción masiva para abrazar lo auténtico.
                        </p>

                        <p className="text-lg text-gray-700 font-body leading-relaxed">
                            Más que simples accesorios de mesa, ofrecemos una experiencia sensorial. La textura del lino, el relieve del bordado y la calidez de nuestros diseños invitan a compartir momentos memorables. Permite que la belleza de lo hecho a mano transforme tus comidas cotidianas en celebraciones de arte y diseño.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
