/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hb-bg': '#050a05',
        'hb-green': '#00ff41',
        'hb-cyan': '#00e5ff',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Syne"', 'sans-serif'],
      },
      backgroundImage: {
        'circuit-pattern': "url('/circuit.svg')",
      }
    },
  },
  plugins: [],
}
