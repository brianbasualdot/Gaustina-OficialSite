import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import InfoSection from '../components/InfoSection';
import { Link } from 'react-router-dom';
import SeoHead from '../components/common/SeoHead';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
                title="Gaustina | Bordados & Textiles"
                description="Diseños únicos en tusor, hechos a mano en Argentina."
            />

            <HeroBanner />

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-script text-brand-primary mb-4 transform -rotate-2">
                        Lo Nuevo
                    </h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Hecho a mano con amor</p>
                </div>

                {/* Dynamic Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <Link to={`/producto/${product.id}`}>
                                    <div className="overflow-hidden mb-4 relative aspect-[4/5] bg-gray-100">
                                        <img
                                            src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/300"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {product.stock <= 0 && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                <span className="bg-black text-white text-xs font-bold px-2 py-1">AGOTADO</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-heading text-gray-900 group-hover:text-gray-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-brand-primary font-medium mt-1">
                                        ${product.price.toLocaleString('es-AR')}
                                    </p>
                                </Link>
                            </div>
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
