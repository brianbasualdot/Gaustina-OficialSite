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
                <p className="text-gray-500 font-body text-sm tracking-wider">
                    ${price}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;
