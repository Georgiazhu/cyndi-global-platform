/** Monochrome / minimal palette, matched to www.cyndiglobal.com (stone grey + black, no color). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#1c1917', deep: '#1c1917', light: '#a8a29e',
        ink: '#1c1917', secondary: '#57534e', body: '#57534e', muted: '#a8a29e',
        surface: '#f5f5f4', line: '#e7e5e4', deepbg: '#1c1917',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
