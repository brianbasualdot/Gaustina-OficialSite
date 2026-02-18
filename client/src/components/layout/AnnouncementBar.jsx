import React from 'react';

const AnnouncementBar = () => {
    return (
        <div className="bg-gray-900 text-white text-xs md:text-sm py-2 px-4 relative z-50 overflow-hidden">
            <div className="container mx-auto text-center animate-marquee whitespace-nowrap">
                <p className="font-medium tracking-wide inline-block">
                    🚚 ENVÍO GRATIS a todo el país por Correo Argentino 🚚
                </p>
            </div>
        </div>
    );
};

export default AnnouncementBar;
