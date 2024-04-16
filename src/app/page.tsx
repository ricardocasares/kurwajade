import {Form} from '@/ui/form'
import {Routes} from '@/ui/routes'

export default async function Home() {
  return <Form to={<Routes name={'stop'} />} />
}
