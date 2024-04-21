import daisyui from 'daisyui'
import type {Config} from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [daisyui],
  daisyui: {
    darkTheme: 'dim',
    themes: ['light', 'dim'],
  },
}
export default config
