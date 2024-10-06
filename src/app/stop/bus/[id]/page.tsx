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
            <div className='flex items-center gap-2 rounded p-2 shadow-md bg-base-300'>
              <div className='flex items-center justify-center text-3xl tabular-nums font-mono p-3 bg-accent-content text-accent rounded'>
                {p.patternText}
              </div>
              <div className='grow'>
                <h2 className='w-32 sm:w-48 md:w-64 lg:w-full text-ellipsis whitespace-nowrap overflow-hidden'>
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
