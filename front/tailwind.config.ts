import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        '6xl': '72rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'petite-orchid-900': '#da9790',
        'petite-orchid-800': '#dea19b',
        'petite-orchid-700': '#e1aca6',
        'petite-orchid-600': '#e5b6b1',
        'petite-orchid-500': '#e9c1bc',
        'petite-orchid-400': '#edcbc8',
        'petite-orchid-300': '#f0d5d3',
        'petite-orchid-200': '#f4e0de',
        'petite-orchid-100': '#f8eae9',
        'petite-orchid-50': '#fbf5f4',
        'dark-blue': '#1a2234',
        'light-blue': '#2a3a5a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0aec0',
        'accent-blue': '#3490dc',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
