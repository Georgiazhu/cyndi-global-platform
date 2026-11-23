/** Monochrome / minimal palette, matched to www.cyndiglobal.com (stone grey + black, no color). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#1c1917', deep: '#1c1917', light: '#a8a29e',
        ink: '#1c1917', secondary: '#57534e', body: '#57534e', muted: '#a8a29e',
        surface: '#f5f5f4', line: '#e7e5e4', deepbg: '#1c1917',
        // Brand-blue hero / final CTA / footer (restored from original design)
        'brand-blue': '#5A7CB7', 'brand-deep': '#141E28', 'brand-light': '#B5C4DF',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
