import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full h-screen min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://nshlnmuanotleqkjfvtz.supabase.co/storage/v1/object/public/products/Hero_Home.jpg"
                    alt="Textura de tela artesanal"
                    className="w-full h-full object-cover"
                />
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 md:bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-4 drop-shadow-lg">
                        Historias tejidas en algodón.
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl font-light text-stone-200 mb-10 tracking-wide">
                        Lencería de mesa artesanal
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
                >
                    <button
                        onClick={() => navigate('/productos')}
                        className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg md:text-xl font-medium px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Ver Colección
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
