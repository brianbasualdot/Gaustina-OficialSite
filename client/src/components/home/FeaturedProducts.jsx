import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// IMPORTANTE: Definir la URL de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Función para pedir los datos reales al Backend
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    // Tomamos solo los primeros 4 para la Home que NO estén pausados
                    const activeProducts = data.filter(p => !p.paused);
                    setProducts(activeProducts.slice(0, 4));
                }
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20">Cargando taller...</div>;

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="font-heading text-4xl text-brand-dark text-center mb-12">
                Nuestras Piezas Favoritas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                            {/* Usamos la imagen real de la DB o un placeholder si falla */}
                            <img
                                src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/400?text=Sin+Foto"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Botón flotante */}
                            <Link
                                to={`/producto/${product.id}`}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 
                           bg-white/90 backdrop-blur text-brand-dark px-6 py-2 
                           rounded-full text-sm font-medium shadow-lg 
                           opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
                           transition-all duration-300 whitespace-nowrap"
                            >
                                Ver Detalle
                            </Link>
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="font-heading text-xl text-brand-dark">{product.name}</h3>
                            <div className="flex flex-col items-center mt-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-green-700">
                                        ${(product.price * 0.95).toLocaleString('es-AR')}
                                    </span>
                                    <span className="text-xs font-bold text-green-700 bg-green-50 px-1 rounded">-5% Transf.</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    ${product.price.toLocaleString('es-AR')} (Lista/MP)
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <Link to="/productos" className="text-brand-dark border-b border-brand-dark pb-1 hover:text-brand-primary hover:border-brand-primary transition-colors">
                    Ver todo el catálogo de bordados →
                </Link>
            </div>
        </section>
    );
};

export default FeaturedProducts;
