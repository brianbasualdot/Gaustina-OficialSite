import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/common/SeoHead';
import ProtectedImage from '../components/common/ProtectedImage';
import { getDisplayPrice, getTransferPrice } from '../utils/productUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const allProducts = await res.json();

                    // Lógica "Ofertas" (Más Baratos)
                    // Ordenar por precio ascendente (usando precio inteligente) y tomar 4
                    const sortedByPrice = [...allProducts].sort((a, b) => {
                        const priceA = getDisplayPrice(a).price;
                        const priceB = getDisplayPrice(b).price;
                        return priceA - priceB;
                    });
                    setOffers(sortedByPrice.slice(0, 4));
                }
            } catch (error) {
                console.error("Error cargando ofertas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="pt-20">
            <SeoHead
                title="Ofertas Especiales | Biblioteca de Bordados"
                description="Aprovecha nuestros mejores precios en lencería de mesa artesanal."
            />
            <div className="bg-[#fefefc] py-12 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-heading text-4xl md:text-5xl text-brand-dark text-center mb-4">
                        Oportunidades
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
                        Calidad premium a precios especiales.
                    </p>

                    {loading ? (
                        <div className="text-center py-20">Buscando oportunidades...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {offers.map((product) => (
                                <Link to={`/producto/${product.id}`} key={product.id} className="group">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative mb-4">
                                        <ProtectedImage
                                            src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/400?text=Sin+Foto"}
                                            hoverSrc={(product.images && product.images.length > 1) ? product.images[1] : null}
                                            alt={product.name}
                                            imgClassName="duration-700"
                                        />
                                        <div className="absolute top-3 right-3 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            OFERTA
                                        </div>
                                    </div>
                                    <h3 className="font-heading text-lg text-brand-dark group-hover:text-brand-primary transition-colors">
                                        {product.name}
                                    </h3>
                                     <div className="mt-2">
                                        {(() => {
                                            const { price, label } = getDisplayPrice(product);
                                            const transferPrice = getTransferPrice(price);
                                            return (
                                                <>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-bold text-green-700">
                                                            ${transferPrice.toLocaleString('es-AR')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">-10% Transf.</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        ${price.toLocaleString('es-AR')} <span className="text-yellow-700/70 font-medium">{label}</span>
                                                    </p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
