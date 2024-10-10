'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {match} from 'ts-pattern'

import {PinButton} from './pin'

import {Bus} from '@/icons/bus'
import {Other} from '@/icons/other'
import {Tram} from '@/icons/tram'
import {StopPassages} from '@/lib/api'
import {Passage} from '@/ui/passage'

type Passages = {
  kind: 'bus' | 'tram' | 'other'
  passages: StopPassages
}

export function Passages({kind, passages}: Passages) {
  const router = useRouter()
  const directions = Array.from(
    new Set(passages.actual.map((p) => p.direction)),
  ).sort((a, b) => a.localeCompare(b))
  const [direction, setDirection] = useState('')
  const filtered = passages.actual.filter((p) =>
    !direction ? true : p.direction === direction,
  )

  return (
    <div className='p-2'>
      <div className='p-3 rounded border border-neutral'>
        <div className='flex gap-2 items-center mb-3'>
          <h1 className='flex gap-2 items-center grow'>
            <VehicleIcon kind={kind} />
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

          <PinButton stop={`${kind}:${passages.stopShortName}`} />
        </div>
        {!filtered.length && (
          <div className='h-64 flex flex-col items-center justify-center'>
            <Other className='w-24 h-24 text-neutral' />
            <h1 className='text-neutral-content'>No passages found</h1>
          </div>
        )}
        {!!filtered.length && (
          <ul className='space-y-2'>
            {filtered.map((passage) => (
              <li key={passage.vehicleId}>
                <Passage passage={passage} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function VehicleIcon({kind}: {kind: Passages['kind']}) {
  return match(kind)
    .with('bus', () => <Bus className='w-6 h-6 text-neutral-content' />)
    .with('tram', () => <Tram className='w-6 h-6 text-neutral-content' />)
    .with('other', () => <Other className='w-6 h-6 text-neutral-content' />)
    .exhaustive()
}
