'use client'

import cn from 'classcat'
import ms from 'ms'
import {useRouter} from 'next/navigation'
import {ReactElement, useState} from 'react'
import {useInterval} from 'usehooks-ts'

import {Other} from '@/icons/other'
import {StopPassages} from '@/lib/api'

type Passages = {
  icon: ReactElement
  passages: StopPassages
}

export function Passages({icon, passages}: Passages) {
  const router = useRouter()
  const directions = Array.from(
    new Set(passages.actual.map((p) => p.direction)),
  ).sort((a, b) => a.localeCompare(b))
  const [direction, setDirection] = useState('')
  const filtered = passages.actual.filter((p) =>
    !direction ? true : p.direction === direction,
  )

  useInterval(() => router.refresh(), 5000)

  console.log({direction, filtered})

  return (
    <div className='p-2'>
      <div className='p-3 bg-base-200 rounded border border-neutral'>
        <div className='flex gap-2 items-center mb-3'>
          <h1 className='flex gap-2 items-center grow'>
            {icon}
            <span>{passages.stopName}</span>
          </h1>
          <select
            className='select select-sm select-bordered w-32 sm:w-fit font-mono text-xs'
            defaultValue={direction}
            onChange={(e) => setDirection(e.target.value)}>
            <option value=''>All directions</option>
            {directions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {!filtered.length && (
          <div className='h-64 flex flex-col items-center justify-center'>
            <Other className='w-24 h-24 text-neutral' />
            <h1 className='text-neutral-content'>No passages found</h1>
          </div>
        )}
        {!!filtered.length && (
          <ul className='space-y-2'>
            {filtered.map((p) => (
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
        )}
      </div>
    </div>
  )
}
