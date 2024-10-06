import {Bus} from '@/icons/bus'
import {getPassages} from '@/lib/api'
import cfg from '@/lib/config'
import {Passages} from '@/ui/passages'

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page(props: PageProps) {
  const passages = await getPassages(props.params.id, cfg.BUS_URL)

  return (
    <Passages
      icon={<Bus className='text-neutral-content w-6 h-6' />}
      passages={passages}
    />
  )
}
