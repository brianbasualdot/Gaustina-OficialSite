/**
 * Procesa una imagen: la redimensiona (opcional) y la convierte a formato WebP.
 * Solo procesa archivos de tipo imagen. Si es un video u otro tipo, lo devuelve tal cual.
 * 
 * @param {File} file - El archivo original.
 * @param {number} maxWidth - Ancho máximo permitido (default 1600px).
 * @param {number} quality - Calidad de compresión WebP (0 a 1).
 * @returns {Promise<File>} - El archivo procesado (WebP) o el original si no es imagen.
 */
export const processImage = async (file, maxWidth = 1600, quality = 0.8) => {
    // Si no es una imagen, no hacemos nada (ej: videos)
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                // Calcular nuevas dimensiones manteniendo la proporción
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // Crear Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a WebP Blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file); // Fallback al original si falla el blob
                            return;
                        }
                        // Crear un nuevo File a partir del Blob
                        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const processedFile = new File([blob], newFileName, {
                            type: 'image/webp',
                            lastModified: Date.now()
                        });
                        resolve(processedFile);
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = () => resolve(file); // Si falla la carga de imagen, devolvemos el original
        };
        reader.onerror = () => resolve(file); // Si falla el reader, devolvemos el original
    });
};
