/** Colors follow docs/DESIGN.md */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#5A7CB7', deep: '#171F2E', light: '#B5C4DF',
        ink: '#253649', secondary: '#425C86', body: '#3B4A5B', muted: '#87909B',
        surface: '#E8ECEF', line: '#E0E3E6', deepbg: '#141E28',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
