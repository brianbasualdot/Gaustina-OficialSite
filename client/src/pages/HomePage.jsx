import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import InfoSection from '../components/InfoSection';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import SeoHead from '../components/common/SeoHead';

import { API_URL } from '../config/api';

const HomePage = () => {
    // Estado para productos destacados (recientes o aleatorios)
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Fetch de productos reales del backend
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                // Tomamos los primeros 4 para mostrar en home
                setFeaturedProducts(data.slice(0, 4));
            })
            .catch(err => console.error("Error fetching homepage products:", err));
    }, []);

    return (
        <div className="bg-white min-h-screen font-body">
            <SeoHead
                title="Gaustina | Neceseres & Bolsos Bordados Personalizados"
                description="Descubrí nuestra colección de neceseres y bolsos bordados a mano. Diseños únicos, 100% algodón, hechos en Argentina. Personalizá el tuyo con iniciales."
                url="/"
            />

            <HeroBanner />

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-heading text-brand-primary mb-2">
                        Nuestros productos
                    </h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm"></p>
                </div>

                {/* Dynamic Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                images={product.images}
                                stock={product.stock}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-400">Cargando productos destacados...</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-12">
                    <Link to="/productos" className="inline-block border-b-2 border-black text-black font-heading uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition-all pb-1">
                        Ver Toda la Colección
                    </Link>
                </div>

                {/* Info Section */}
                <InfoSection />
            </div>
        </div>
    );
};

export default HomePage;
