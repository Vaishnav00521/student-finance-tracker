/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"Outfit"', 'sans-serif'],
                'display': ['"Space Grotesk"', 'sans-serif'],
            },
            colors: {
                'slate': {
                    950: '#020617',
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(220, 38, 38, 0.15)',
                'glow-strong': '0 0 30px rgba(220, 38, 38, 0.25)',
                'glow-lg': '0 0 40px rgba(220, 38, 38, 0.2)',
            },
            animation: {
                'aurora': 'aurora 20s ease infinite',
                'aurora-slow': 'aurora 30s ease infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                aurora: {
                    '0%, 100%': { opacity: '0.3', transform: 'translateX(0) translateY(0)' },
                    '25%': { opacity: '0.5', transform: 'translateX(5%) translateY(-5%)' },
                    '50%': { opacity: '0.3', transform: 'translateX(-5%) translateY(5%)' },
                    '75%': { opacity: '0.4', transform: 'translateX(3%) translateY(3%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
