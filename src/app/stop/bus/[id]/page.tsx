import ms from 'ms'

import {Bus} from '@/icons/bus'
import {getPassages} from '@/lib/api'
import cfg from '@/lib/config'

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page(props: PageProps) {
  const passages = await getPassages(props.params.id, cfg.BUS_URL)

  return (
    <div className='p-2'>
      <h1 className='text-2xl flex gap-2 items-center mb-3'>
        <Bus className='text-accent-content' />
        <span>{passages.stopName}</span>
      </h1>
      <ul className='space-y-2'>
        {passages.actual.map((p) => (
          <li key={p.vehicleId}>
            <div className='flex items-center gap-2 rounded p-2 bg-base-300 border border-neutral'>
              <div className='flex items-center justify-center text-xl tabular-nums font-bold p-3 bg-accent text-accent-content rounded'>
                {p.patternText}
              </div>
              <div className='grow'>
                <h2 className='w-48 sm:w-96 md:w-full text-ellipsis whitespace-nowrap overflow-hidden'>
                  {p.direction}
                </h2>
                <h3>{p.plannedTime}</h3>
              </div>
              <div className='p-3 text-xl font-bold text-success'>
                {ms(p.actualRelativeTime * 1000)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
