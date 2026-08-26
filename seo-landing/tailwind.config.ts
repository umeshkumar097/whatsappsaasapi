import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wa-green': '#25d366',
        'wa-dark': '#128c7e',
        'wa-bg': '#0a2a1a',
        'wa-bg2': '#064e3b',
        'wa-bg3': '#0d3b26',
      },
    },
  },
  plugins: [],
}

export default config
