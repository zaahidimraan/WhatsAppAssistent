/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg0: '#05060a',
        bg1: '#0a0c14',
        bg2: '#11141f',
        cyber: '#38bdf8',
        'cyber-glow': '#0ea5e9',
        electric: '#a855f7',
        'electric-glow': '#c084fc',
        ink: '#e8ecf5',
        'ink-dim': '#8a93a8',
        'ink-faint': '#535a6e',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'spin-y': 'spinY 28s linear infinite',
        'spin-xy': 'spinXY 18s linear infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
      keyframes: {
        spinY: { from: { transform: 'rotateY(0deg)' }, to: { transform: 'rotateY(360deg)' } },
        spinXY: { from: { transform: 'rotateX(0) rotateY(0) rotateZ(0)' }, to: { transform: 'rotateX(360deg) rotateY(360deg) rotateZ(180deg)' } },
        'float-y': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-soft': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
