// client/src/utils/productUtils.js

/**
 * Calculates the best display price for a product.
 * If base price is 0, it Fallbacks to packs: x2, then x4, then x6.
 * @param {Object} product - The product object from the API.
 * @returns {Object} { price: number, label: string, pack: string|null, isPack: boolean }
 */
export const getDisplayPrice = (product) => {
    if (!product) return { price: 0, label: '', pack: null, isPack: false };

    // 1. If there's a base price, use it
    if (product.price > 0) {
        return { 
            price: product.price, 
            label: '(Lista)', 
            pack: null, 
            isPack: false 
        };
    }

    // 2. Fallback to packs
    if (product.priceX2 > 0) {
        return { 
            price: product.priceX2, 
            label: '(Pack x2)', 
            pack: 'x2', 
            isPack: true 
        };
    }
    if (product.priceX4 > 0) {
        return { 
            price: product.priceX4, 
            label: '(Pack x4)', 
            pack: 'x4', 
            isPack: true 
        };
    }
    if (product.priceX6 > 0) {
        return { 
            price: product.priceX6, 
            label: '(Pack x6)', 
            pack: 'x6', 
            isPack: true 
        };
    }

    // 3. Fallback to 0
    return { 
        price: product.price || 0, 
        label: '', 
        pack: null, 
        isPack: false 
    };
};

/**
 * Calculates the discounted price for Bank Transfer (10% OFF).
 * @param {number} price - The original price.
 * @returns {number}
 */
export const getTransferPrice = (price) => {
    return price * 0.90;
};

/**
 * Strips Markdown syntax from a string to get plain text.
 * @param {string} text - The markdown text.
 * @returns {string}
 */
export const stripMarkdown = (text) => {
    if (!text) return "";
    return text
        .replace(/#+\s/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/`{1,3}.*?`{1,3}/g, '') // Remove code
        .replace(/>\s/g, '') // Remove blockquotes
        .replace(/(\n|\r)+/g, ' ') // Replace newlines with space
        .trim();
};
