/** Cyndi Global brand palette — Pantone Dragon Fire (#E2501D) + brand grey (#474747). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Pantone Dragon Fire brand color
        fire: '#E2501D',
        'fire-dark': '#C44316',
        'fire-soft': '#FCEFE8',   // soft orange surface
        'fire-tint': '#FFF7F3',   // hero gradient start
        'brand-gray': '#474747',  // logo wordmark grey
        // Semantic tokens
        ink: '#1A1A1A',
        secondary: '#5B5652',
        body: '#5B5652',
        muted: '#96908A',
        surface: '#F7F5F2',
        line: '#E9E4DE',
        deepbg: '#1A1A1A',
        // Legacy aliases kept so any lingering utilities still resolve
        accent: '#E2501D', deep: '#1A1A1A', light: '#96908A',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
