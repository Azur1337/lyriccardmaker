/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1C1C1E',
        primary: '#0f1011',
        secondary: '#3A3A3C',
        textPrimary: '#e5e3df',
        textSecondary: "#94908a",
        border: '#27272a',
        custom: {
            red: { light: '#E63F4C', dark: '#FF453A' },
            orange: { light: '#FF9500', dark: '#FF9F0A' },
            yellow: { light: '#FFCC00', dark: '#FFD60A' },
            green: { light: '#34C759', dark: '#32D74B' },
            teal: { light: '#5AC8FA', dark: '#64D2FF' },
            blue: { light: '#007AFF', dark: '#0A84FF' },
            indigo: { light: '#5856D6', dark: '#5E5CE6' },
            purple: { light: '#AF52DE', dark: '#BF5AF2' },
            pink: { light: '#FF2D55', dark: '#DD2D55' },
            gray: {
                light: {
                    1: '#8E8E93',
                    2: '#AEAEB2',
                    3: '#C7C7CC',
                    4: '#D1D1D6',
                    5: '#E5E5EA',
                    6: '#F2F2F7'
                },
                dark: {
                    1: '#8E8E93',
                    2: '#636366',
                    3: '#48484A',
                    4: '#3A3A3C',
                    5: '#2C2C2E',
                    6: '#1C1C1E'
                }
            }
        },
      },
    },
  },
  plugins: [],
}

