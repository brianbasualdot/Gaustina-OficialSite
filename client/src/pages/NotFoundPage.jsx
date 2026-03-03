import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Home, Search } from 'lucide-react';
import SeoHead from '../components/common/SeoHead';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
            <SeoHead
                title="Página no encontrada | Gaustina"
                description="Lo sentimos, no pudimos encontrar lo que buscabas."
            />

            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="bg-brand-primary/5 p-8 rounded-full"
                            >
                                <Search size={64} className="text-brand-primary opacity-20" />
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl font-heading text-brand-primary opacity-10">404</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-heading text-gray-900 mb-4">
                        Perdimos el rastro
                    </h1>

                    <p className="text-gray-500 font-body mb-10 leading-relaxed">
                        Parece que este producto o página se ha movido o ya no está disponible. No te preocupes, tenemos mucho más para mostrarte.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm font-medium uppercase tracking-widest"
                        >
                            <Home size={18} />
                            Volver al Inicio
                        </button>

                        <button
                            onClick={() => navigate('/productos')}
                            className="flex items-center justify-center gap-2 bg-white text-black border border-gray-200 px-8 py-3 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md active:scale-95 text-sm font-medium uppercase tracking-widest"
                        >
                            <ShoppingBag size={18} />
                            Ver Colección
                        </button>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <p className="text-xs text-gray-400 italic">
                            ¿Necesitás ayuda? Contactanos por <a href="https://wa.me/5491138902507" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold">WhatsApp</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
