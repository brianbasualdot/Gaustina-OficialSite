import React, { useState, useEffect } from 'react';

const HeroBanner = () => {
    const banners = [
        {
            url: "https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/Banner(1690%20x%20590px.png",
            showContent: true,
            showOverlay: false
        },
        {
            url: "https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/banner%20celeste%20(1920%20x%201080%20px)%20(1690%20x%20590px).png",
            showContent: false,
            showOverlay: true
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden bg-white">
            {/* Carousel Images */}
            {banners.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={item.url}
                        alt={`Bordados Hero ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                    {item.showOverlay && <div className="absolute inset-0 bg-black/30"></div>}
                </div>
            ))}

            {/* Content - Only shown if showContent is true for current slide */}
            {banners[currentSlide].showContent && (
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto transition-opacity duration-500 transform translate-y-24">
                    <h1 className="text-5xl md:text-7xl font-heading text-white mb-4 tracking-wide drop-shadow-md">

                    </h1>
                    <p className="text-lg md:text-xl font-heading font-light text-gray-100 mb-10 max-w-2xl mx-auto tracking-wider uppercase">

                    </p>
                    <button className="bg-transparent border border-white text-white px-10 py-3 font-heading font-normal uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-brand-primary transition-all duration-500 ease-in-out">
                        Personaliza el tuyo
                    </button>
                </div>
            )}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                        aria-label={`Ir a slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;


