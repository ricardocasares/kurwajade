import {z} from 'zod'

const config = z.object({
  BUS_URL: z.string().url(),
  TRAM_URL: z.string().url(),
})

export default config.parse(process.env)
