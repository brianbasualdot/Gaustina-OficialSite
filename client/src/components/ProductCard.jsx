import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, price, image }) => {
    return (
        <Link to={`/producto/${id}`} className="group relative w-full cursor-pointer block">
            {/* Image */}
            <div className="w-full aspect-square overflow-hidden bg-gray-100 mb-4 relative z-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
            </div>

            {/* Content - Simple & Flat */}
            <div className="text-center">
                <h3 className="text-brand-primary font-heading text-lg mb-1 group-hover:text-brand-accent transition-colors font-medium tracking-wide">
                    {name}
                </h3>
                <div className="flex flex-col items-center gap-1 mt-2">
                    <p className="text-gray-600 font-body text-sm tracking-wide">
                        ${price.toLocaleString('es-AR')}{" "}
                        <span className="text-[10px] text-gray-400 uppercase font-medium ml-1">
                            (Lista / MP)
                        </span>
                    </p>
                    <p className="text-brand-primary font-body text-base font-semibold tracking-wider">
                        ${(price * 0.85).toLocaleString('es-AR')}{" "}
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold ml-1 uppercase border border-green-100">
                            Transferencia
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
