/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#333333', // Gris oscuro casi negro
                    secondary: '#f7f7f7', // Gris muy claro
                    accent: '#a855f7', // Violeta suave
                },
                background: {
                    DEFAULT: '#ffffff', // Blanco puro
                }
            },
            fontFamily: {
                heading: ['Montserrat', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                script: ['Cedarville Cursive', 'cursive'],
            }
        },
    },
    plugins: [],
}
