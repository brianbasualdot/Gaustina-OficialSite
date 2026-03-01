import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import SeoHead from '../components/common/SeoHead';
import { Truck, ZoomIn, Play } from 'lucide-react';
import { motion } from 'framer-motion';

// 1. IMPORTAR LA LIBRERÍA Y SUS ESTILOS
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

const INITIALS_COLORS = [
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Negro', hex: '#000000' },
    { name: 'Naranja', hex: '#E67E22' },
    { name: 'Dorado', hex: '#D4AF37' },
    { name: 'Verde Oscuro', hex: '#064E3B' },
    { name: 'Rosa Pastel', hex: '#FFD1DC' },
    { name: 'Azul Celeste', hex: '#87CEEB' }
];

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('materiales');

    // 2. NUEVO ESTADO: Controla si la galería a pantalla completa está abierta
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // PERSONALIZACIÓN
    const [selectedFabricColor, setSelectedFabricColor] = useState(null);
    const [selectedEmbroideryColor, setSelectedEmbroideryColor] = useState(null);
    const [initialsCount, setInitialsCount] = useState(1);
    const [initialsValue, setInitialsValue] = useState("");
    const [selectedInitialsColor, setSelectedInitialsColor] = useState(INITIALS_COLORS[1].name); // Default: Negro

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.images && data.images.length > 0) {
                        setSelectedImage(data.images[0]);
                    }
                    // Auto-select first option if available
                    if (data.customizationOptions?.fabricColors?.length > 0) {
                        const first = data.customizationOptions.fabricColors[0];
                        setSelectedFabricColor(typeof first === 'object' ? first.name : first);
                    }
                    if (data.customizationOptions?.embroideryColors?.length > 0) {
                        const first = data.customizationOptions.embroideryColors[0];
                        setSelectedEmbroideryColor(typeof first === 'object' ? first.name : first);
                    }
                }
            } catch (error) {
                console.error("Error buscando producto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!product) return;

        const customization = {};
        if (product.customizationOptions?.fabricColors?.length > 0) {
            customization.fabricColor = selectedFabricColor;
        }
        if (product.customizationOptions?.embroideryColors?.length > 0) {
            customization.embroideryColor = selectedEmbroideryColor;
        }
        if (product.customizationOptions?.allowInitials && initialsValue) {
            customization.initials = initialsValue;
            customization.initialsColor = selectedInitialsColor;
        }

        const productToAdd = {
            ...product,
            selectedCustomizations: Object.keys(customization).length > 0 ? customization : null
        };

        for (let i = 0; i < quantity; i++) addToCart(productToAdd);

        showToast(`¡Agregaste ${quantity} ${product.name} al carrito!`);
    };

    if (loading) return (
        <div className="pt-24 min-h-screen flex items-center justify-center animate-pulse">
            Cargando taller...
        </div>
    );

    if (!product) return (
        <div className="pt-24 container mx-auto px-4 py-24 text-center">
            <h2 className="text-2xl font-heading mb-4">Producto no encontrado</h2>
            <Link to="/productos" className="bg-black text-white px-6 py-2 rounded-full">
                Volver
            </Link>
        </div>
    );

    const hasImages = product.images && product.images.length > 0;
    const mainImageSrc = selectedImage || "https://via.placeholder.com/600?text=Sin+Imagen";

    return (
        <div className="pt-20 md:pt-24">
            <SeoHead
                title={`${product.name} | Gaustina`}
                description={`Compra ${product.name}. Tusor premium bordado a mano.`}
                image={selectedImage}
            />

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-black">Inicio</Link> /
                    <Link to="/productos" className="hover:text-black mx-1">Colección</Link> /
                    <span className="text-gray-800 font-medium mx-1">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-4">
                        <div
                            className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative group cursor-zoom-in"
                            onClick={() => hasImages && setIsGalleryOpen(true)}
                        >
                            {isVideo(mainImageSrc) ? (
                                <video src={mainImageSrc} className="w-full h-full object-cover" controls autoPlay muted loop playsInline />
                            ) : (
                                <img src={mainImageSrc} alt={product.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                            )}
                            {hasImages && !isVideo(mainImageSrc) && (
                                <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn size={20} />
                                </div>
                            )}
                        </div>

                        {hasImages && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${selectedImage === img ? 'border-black opacity-100 ring-1 ring-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        {isVideo(img) ? (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                                <video src={img} className="w-full h-full object-cover absolute inset-0 opacity-50" />
                                                <Play size={24} className="text-white relative z-10" fill="currentColor" />
                                            </div>
                                        ) : (
                                            <img src={img} alt={`Vista ${index}`} className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-5xl md:text-6xl font-heading text-brand-primary mb-4">{product.name}</h1>
                        <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">Tusor Premium • Hecho a Mano</p>
                        <div className="flex flex-col mb-6">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-bold text-green-700">${(product.price * 0.85).toLocaleString('es-AR')}</span>
                                <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">-15% Transferencia</span>
                            </div>
                            <span className="text-lg text-gray-500">${product.price.toLocaleString('es-AR')} (Precio de Lista / Mercado Pago)</span>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3 mb-8">
                            <Truck className="text-green-700 w-5 h-5" />
                            <span className="text-green-800 text-sm font-medium">Envío Gratis incluido a todo el país.</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light whitespace-pre-wrap">{product.description}</p>

                        {product.customizationOptions && (
                            <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-6">
                                {product.customizationOptions.fabricColors?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Color de Tela: <span className="text-gray-500 font-normal">{selectedFabricColor}</span></h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.customizationOptions.fabricColors.map(color => {
                                                const colorName = typeof color === 'object' ? color.name : color;
                                                const colorHex = typeof color === 'object' ? color.hex : null;
                                                const isSelected = selectedFabricColor === colorName;
                                                return colorHex ? (
                                                    <button key={colorName} onClick={() => setSelectedFabricColor(colorName)} className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: colorHex }} />
                                                ) : (
                                                    <button key={colorName} onClick={() => setSelectedFabricColor(colorName)} className={`px-4 py-2 border rounded-full text-sm transition-all ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>{colorName}</button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {product.customizationOptions.embroideryColors?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Color de Bordado: <span className="text-gray-500 font-normal">{selectedEmbroideryColor}</span></h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.customizationOptions.embroideryColors.map(color => {
                                                const colorName = typeof color === 'object' ? color.name : color;
                                                const colorHex = typeof color === 'object' ? color.hex : null;
                                                const isSelected = selectedEmbroideryColor === colorName;
                                                return colorHex ? (
                                                    <button key={colorName} onClick={() => setSelectedEmbroideryColor(colorName)} className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: colorHex }} />
                                                ) : (
                                                    <button key={colorName} onClick={() => setSelectedEmbroideryColor(colorName)} className={`px-4 py-2 border rounded-full text-sm transition-all ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>{colorName}</button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {product.customizationOptions?.allowInitials && (
                            <div className="mb-8 p-6 bg-brand-secondary/10 rounded-2xl border border-brand-secondary/20">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Personalización de Iniciales</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-2">Cantidad de iniciales:</label>
                                        <div className="flex gap-3">
                                            {[1, 2].map(num => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        setInitialsCount(num);
                                                        setInitialsValue("");
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${initialsCount === num ? 'bg-black text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-black'}`}
                                                >
                                                    {num} {num === 1 ? 'Inicial' : 'Iniciales'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600 block mb-2">Ingresa las iniciales:</label>
                                        <div className="flex flex-col sm:flex-row items-center gap-6">
                                            <input
                                                type="text"
                                                maxLength={initialsCount}
                                                value={initialsValue}
                                                onChange={(e) => setInitialsValue(e.target.value.toUpperCase())}
                                                placeholder={initialsCount === 1 ? "Eje: A" : "Eje: AB"}
                                                className="w-full max-w-[200px] border-b-2 border-gray-200 focus:border-black py-2 text-3xl font-heading text-center focus:outline-none tracking-[0.5em] bg-transparent"
                                                style={{ color: INITIALS_COLORS.find(c => c.name === selectedInitialsColor)?.hex || '#000' }}
                                            />

                                            <div className="flex-1">
                                                <label className="text-xs text-gray-400 block mb-2 uppercase">Color del bordado:</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {INITIALS_COLORS.map(color => (
                                                        <button
                                                            key={color.name}
                                                            onClick={() => setSelectedInitialsColor(color.name)}
                                                            className={`w-6 h-6 rounded-full border border-gray-200 transition-all ${selectedInitialsColor === color.name ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-110'}`}
                                                            style={{ backgroundColor: color.hex }}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-gray-500 mt-1 italic">{selectedInitialsColor}</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 uppercase text-center sm:text-left">Máximo {initialsCount} {initialsCount === 1 ? 'letra' : 'letras'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-100 pb-10">
                            <div className="flex items-center border border-gray-300 w-max">
                                <button onClick={handleDecrement} className="px-4 py-3 hover:bg-gray-50 text-black font-heading">-</button>
                                <span className="w-8 text-center font-heading text-lg">{quantity}</span>
                                <button onClick={handleIncrement} className="px-4 py-3 hover:bg-gray-50 text-black font-heading">+</button>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || product.paused}
                                className="flex-1 bg-transparent border border-black text-black font-heading uppercase tracking-widest text-sm py-3 px-8 hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {product.paused ? 'Publicación Pausada' : product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                            </motion.button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-6 border-b border-gray-200 pb-2">
                                {['materiales', 'cuidados', 'envios'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm uppercase tracking-wide transition-colors ${activeTab === tab ? 'border-b-2 border-black text-black font-medium' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
                                ))}
                            </div>
                            <div className="py-4 text-gray-600 text-sm leading-relaxed min-h-[100px]">
                                {activeTab === 'materiales' && <p>Confeccionado en Tusor 100% algodón de alto gramaje.</p>}
                                {activeTab === 'cuidados' && <ul className="list-disc pl-5 space-y-1"><li>Lavar a mano o ciclo delicado (agua fría).</li><li>Secar a la sombra.</li></ul>}
                                {activeTab === 'envios' && <p>Despachamos por Correo Argentino dentro de las 48hs hábiles.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {hasImages && (
                <Lightbox
                    open={isGalleryOpen}
                    close={() => setIsGalleryOpen(false)}
                    index={product.images.indexOf(selectedImage)}
                    slides={product.images.map(imgUrl => isVideo(imgUrl) ? { type: "video", sources: [{ src: imgUrl, type: "video/mp4" }] } : { src: imgUrl })}
                    render={{
                        slide: ({ slide }) => {
                            if (slide.type === "video") {
                                return (
                                    <video className="max-h-[80vh] max-w-[90vw] object-contain mx-auto" controls autoPlay muted={false} playsInline>
                                        <source src={slide.sources[0].src} type="video/mp4" />
                                        Tu navegador no soporta el elemento de video.
                                    </video>
                                );
                            }
                            return undefined;
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
