/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solaris: {
          navy: '#163A5F',
          blue: '#2563EB',
          teal: '#0F9D8A',
          amber: '#F4B740',
          bg: '#F5F7FA',
          card: '#FFFFFF',
          text: '#1F2937',
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
