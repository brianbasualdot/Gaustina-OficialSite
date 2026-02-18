import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollectionsGrid = () => {
    const navigate = useNavigate();

    return (
        <section className="container mx-auto px-4 py-20 relative z-20 bg-white">
            <h2 className="sr-only">Nuestras Colecciones</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr md:h-[750px]">
                {/* Large Left Card */}
                <div
                    onClick={() => navigate('/categoria/individuales')}
                    className="relative md:col-span-1 group overflow-hidden rounded-2xl cursor-pointer h-[400px] md:h-full"
                >
                    <img
                        src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/Home-Individuales.jpg"
                        alt="Individuales Premium"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-3xl font-serif font-medium">Individuales</h3>
                        <p className="text-white/80 text-sm mt-2">Texturas naturales</p>
                    </div>
                </div>

                {/* Right Column Stack */}
                <div className="md:col-span-2 flex flex-col gap-6 md:h-full">
                    {/* Top Right */}
                    <div
                        onClick={() => navigate('/categoria/posavasos')}
                        className="relative flex-1 group overflow-hidden rounded-2xl cursor-pointer h-[300px] md:h-auto"
                    >
                        <img
                            src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/Posa-Vasos-Home.png"
                            alt="Posavasos"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-serif font-medium">Posavasos</h3>
                            <p className="text-white/80 text-sm mt-1">Detalles que importan</p>
                        </div>
                    </div>

                    {/* Bottom Right */}
                    <div
                        onClick={() => navigate('/categoria/servilletas')}
                        className="relative flex-1 group overflow-hidden rounded-2xl cursor-pointer h-[300px] md:h-auto"
                    >
                        <img
                            src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/Portada-Servilletas-tusaor.png"
                            alt="Servilletas"
                            className="w-full h-full object-cover md:object-[center_70%] transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-serif font-medium">Servilletas</h3>
                            <p className="text-white/80 text-sm mt-1">Elegancia para compartir</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionsGrid;
