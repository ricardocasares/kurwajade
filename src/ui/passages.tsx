'use client'

import cn from 'classcat'
import ms from 'ms'
import {useRouter} from 'next/navigation'
import {ReactElement} from 'react'
import {useInterval} from 'usehooks-ts'

import {StopPassages} from '@/lib/api'

type Passages = {
  icon: ReactElement
  passages: StopPassages
}

export function Passages({icon, passages}: Passages) {
  const router = useRouter()

  useInterval(() => router.refresh(), 5000)

  return (
    <div className='p-2'>
      <div className='p-2 bg-base-200 rounded border border-neutral'>
        <h1 className='text-xl flex gap-2 items-center my-3'>
          {icon}
          <span>{passages.stopName}</span>
        </h1>
        <ul className='space-y-2'>
          {passages.actual.map((p) => (
            <li key={p.vehicleId}>
              <div className='flex items-center gap-2 rounded p-2 bg-base-100 border border-neutral'>
                <div className='font-mono flex items-center justify-center text-xl tabular-nums font-bold p-3 bg-accent text-accent-content rounded min-w-16'>
                  {p.patternText}
                </div>
                <div className='grow'>
                  <h2 className='w-48 sm:w-96 md:w-full text-ellipsis whitespace-nowrap overflow-hidden'>
                    {p.direction}
                  </h2>
                  <h3 className='font-mono text-xs text-neutral-content'>
                    {p.status} {p.plannedTime}
                  </h3>
                </div>
                <div
                  className={cn([
                    {
                      'text-warning': p.status === 'DELAYED',
                      'text-success': [
                        'PLANNED',
                        'PREDICTED',
                        'STOPPING',
                      ].includes(p.status),
                      'animate-pulse': p.status === 'STOPPING',
                    },
                    'w-16 text-center font-bold tabular-nums',
                  ])}>
                  {ms(p.actualRelativeTime * 1000)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
