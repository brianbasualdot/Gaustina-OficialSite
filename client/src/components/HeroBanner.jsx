import React from 'react';

const HeroBanner = () => {
    return (
        <div className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop"
                    alt="Bordados Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-script text-white mb-4 tracking-wide drop-shadow-md">
                    Gaustina
                </h1>
                <p className="text-lg md:text-xl font-heading font-light text-gray-100 mb-10 max-w-2xl mx-auto tracking-wider uppercase">
                    Necessers & Bags Personalizados
                </p>
                <button className="bg-transparent border border-white text-white px-10 py-3 font-heading font-normal uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-brand-primary transition-all duration-500 ease-in-out">
                    Ver Colección
                </button>
            </div>
        </div>
    );
};

export default HeroBanner;
