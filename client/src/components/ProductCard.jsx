import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, price, images, image, stock }) => {
    // Manejo de imágenes: preferimos la prop 'images' (array) pero aceptamos 'image' como fallback
    const primaryImage = (images && images.length > 0) ? images[0] : (image || "https://via.placeholder.com/600?text=Sin+Imagen");
    const secondaryImage = (images && images.length > 1) ? images[1] : null;

    return (
        <Link to={`/producto/${id}`} className="group relative w-full cursor-pointer block">
            {/* Image Container */}
            <div className="w-full aspect-[4/5] overflow-hidden bg-gray-100 mb-4 relative z-0 rounded-sm">
                {/* Primary Image */}
                <img
                    src={primaryImage}
                    alt={name}
                    className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${secondaryImage ? 'group-hover:opacity-0' : ''}`}
                />
                
                {/* Secondary Image (Hover) */}
                {secondaryImage && (
                    <img
                        src={secondaryImage}
                        alt={`${name} - Vista alternativa`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                    />
                )}

                {/* Stock Overlay */}
                {stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                            AGOTADO
                        </span>
                    </div>
                )}

                {/* Invisible protection layer to prevent right click/drag on hover too */}
                <div 
                    className="absolute inset-0 z-10 bg-transparent" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>

            {/* Content */}
            <div className="text-center px-2">
                <h3 className="text-brand-primary font-heading text-base mb-1 group-hover:text-gray-600 transition-colors font-medium tracking-wide truncate">
                    {name}
                </h3>
                <div className="flex flex-col items-center gap-1 mt-2">
                    <p className="text-gray-500 font-body text-[11px] tracking-wide">
                        ${price.toLocaleString('es-AR')}{" "}
                        <span className="text-[9px] text-gray-400 uppercase font-medium ml-1">
                            (Lista)
                        </span>
                    </p>
                    <p className="text-brand-primary font-body text-sm font-semibold tracking-wider">
                        ${(price * 0.85).toLocaleString('es-AR')}{" "}
                        <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-bold ml-1 uppercase border border-green-100">
                            Transferencia
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
