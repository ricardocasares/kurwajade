import {getPassages} from '@/lib/api'
import cfg from '@/lib/config'
import {Passages} from '@/ui/passages'
import {Refresh} from '@/ui/refresh'

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page(props: PageProps) {
  const passages = await getPassages(props.params.id, cfg.TRAM_URL)

  return (
    <>
      <Refresh interval={30_000} />
      <Passages kind='tram' passages={passages} />
    </>
  )
}
