import React from 'react';

const StorySection = () => {
    return (
        <section className="bg-stone-50 py-20 md:py-32 relative z-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {/* Image Side */}
                    <div className="w-full md:w-1/2">
                        <div className="relative z-10 aspect-[4/5] md:aspect-square overflow-hidden rounded-xl shadow-lg">
                            <img
                                src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/bdb-home-history.png"
                                alt="Manos trabajando en bordado"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
                            Del bastidor a tu mesa.
                        </h2>
                        <div className="space-y-6 text-lg text-stone-600 font-light leading-relaxed">
                            <p>
                                En nuestro taller de La Plata, cada pieza comienza con un boceto simple y una intención clara. Usamos Tusor 100% algodón, elegido por su caída y su textura honesta.
                            </p>
                            <p>
                                Dedicamos horas a cada puntada, no porque sea necesario, sino porque creemos que la energía de lo hecho a mano se transmite. No es solo decoración, es tiempo materializado que ahora forma parte de tu hogar.
                            </p>
                        </div>

                        <div className="mt-10">
                            <span className="inline-block border-b border-stone-900 pb-1 text-stone-900 uppercase tracking-widest text-sm font-semibold cursor-pointer hover:text-stone-600 hover:border-stone-600 transition-colors">
                                Conoce nuestra historia
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
