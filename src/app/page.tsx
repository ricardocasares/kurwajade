import {P, match} from 'ts-pattern'

import {connections} from '@/db'
import {parseSearchParams} from '@/lib/validation'
import {Passage, Skeleton} from '@/ui/Passage'
import {Input} from '@/ui/input'

type PageProps = {
  params: {slug: string}
  searchParams: {[key: string]: string | string[] | undefined}
}
export default async function Home({searchParams}: PageProps) {
  const passages = match(parseSearchParams(searchParams))
    .with({success: true, output: P.select()}, connections)
    .with({success: false}, () => [])
    .exhaustive()

  const view = match(passages)
    .with(P.array(P.not(P.nullish)), (passages) =>
      passages.map((p) => (
        <Passage
          key={p.id}
          type={p.type}
          stop={p.stop}
          headsign={p.headsign}
          route={p.route}
          timestamp={p.estimated}
        />
      )),
    )
    .with(P.array(), () => <Skeleton />)
    .exhaustive()

  return (
    <div className='h-screen bg-base-200'>
      <div className='flex flex-col gap-3 p-2'>
        <Input />
      </div>
      <div className='flex flex-col gap-4 p-2'>{view}</div>
    </div>
  )
}
