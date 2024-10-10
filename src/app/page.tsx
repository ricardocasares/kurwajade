import {cookies} from 'next/headers'
import {match, P} from 'ts-pattern'

import {Other} from '@/icons/other'
import {getPassages} from '@/lib/api'
import config from '@/lib/config'
import {all} from '@/lib/pinned'
import {Passages} from '@/ui/passages'
import {Refresh} from '@/ui/refresh'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const pinned = await all()
  const passages = await Promise.all(
    pinned
      .map((pin) => pin.split(':'))
      .map(([kind, id]) => {
        if (kind === 'bus')
          return getPassages(id, config.BUS_URL).then((passages) => ({
            ...passages,
            kind,
          }))
        return getPassages(id, config.TRAM_URL).then((passages) => ({
          ...passages,
          kind,
        }))
      }),
  )

  return (
    <>
      <Refresh interval={30_000} />
      {match(passages)
        .with([], () => <Empty />)
        .with(P.array({stopName: P.string}), (p) =>
          p.map((p) => (
            // @ts-ignore
            <Passages key={p.stopShortName} kind={p.kind} passages={p} />
          )),
        )
        .exhaustive()}
    </>
  )
}

const Empty = () => (
  <div className='h-96 flex flex-col items-center justify-center'>
    <Other className='w-24 h-24 text-neutral' />
    <h1 className='text-neutral-content'>
      You don&apos;t have any saved stops
    </h1>
  </div>
)
