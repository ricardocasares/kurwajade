import {get_stops} from '@/lib/api'
import {Form} from '@/ui/form'

export default async function Home() {
  return <Form stops={await get_stops()} />
}
