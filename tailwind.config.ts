import daisyui from 'daisyui'
import type {Config} from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [daisyui],
  daisyui: {
    darkTheme: 'synthwave',
    themes: ['cupcake', 'synthwave'],
  },
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': {transform: 'translateX(0%)'},
          '50%': {transform: 'translateX(-100%)'},
          '100%': {transform: 'translateX(0%)'},
        },
      },
    },
  },
}
export default config
