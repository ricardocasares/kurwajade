import {Transport} from '@/lib/api'
import {Form} from '@/ui/form'

export default async function Home() {
  const api = new Transport('http://91.223.13.70')
  const stops = await api.stops()

  return <Form stops={stops} />
}
