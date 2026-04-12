import React from 'react';

/**
 * Componente que protege las imágenes deshabilitando el menú contextual (clic derecho),
 * el arrastre (drag) y agregando una capa protectora transparente encima.
 */
const ProtectedImage = ({ src, hoverSrc, alt, className = "", imgClassName = "", objectFit = "cover", ...props }) => {
    const preventDefault = (e) => {
        e.preventDefault();
    };

    return (
        <div 
            className={`relative select-none group/img overflow-hidden ${className}`}
            onContextMenu={preventDefault}
            onClick={props.onClick}
        >
            {/* Imagen Principal */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-${objectFit} transition-opacity duration-1000 ${hoverSrc ? 'group-hover/img:opacity-0' : ''} ${imgClassName}`}
                onDragStart={preventDefault}
                onContextMenu={preventDefault}
            />

            {/* Imagen de Hover (opcional) */}
            {hoverSrc && (
                <img
                    src={hoverSrc}
                    alt={`${alt} hover`}
                    className={`absolute inset-0 w-full h-full object-${objectFit} opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000 ${imgClassName}`}
                    onDragStart={preventDefault}
                    onContextMenu={preventDefault}
                />
            )}

            {/* Capa protectora transparente overlay */}
            <div 
                className={`absolute inset-0 z-10 bg-transparent ${props.onClick ? (className.includes('zoom-out') ? 'cursor-zoom-out' : 'cursor-zoom-in') : 'cursor-default'}`}
                onContextMenu={preventDefault}
                onDragStart={preventDefault}
                onClick={props.onClick}
            />
        </div>
    );
};

export default ProtectedImage;
