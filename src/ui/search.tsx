'use client'

import Link from 'next/link'
import {useFormState} from 'react-dom'

import {Bus} from '@/icons/bus'
import {Other} from '@/icons/other'
import {Tram} from '@/icons/tram'
import {autocompleteAction, type Stop, type AutoCompleteState} from '@/lib/api'

const initial: AutoCompleteState = {
  query: '',
  stops: [],
}

export function Search() {
  const [state, formAction] = useFormState(autocompleteAction, initial)

  return (
    <form action={formAction}>
      <details
        open={!!state.stops.length}
        className='dropdown w-full dropdown-hover appearance-none'>
        <summary className='appearance-none list-none'>
          <input
            type='text'
            name='query'
            className='input w-full input-bordered'
            autoComplete='off'
            placeholder='Search for a stop'
          />
        </summary>
        <div className='dropdown-content w-full max-h-64 overflow-scroll rounded-lg shadow-xl'>
          <ul className='menu bg-accent text-accent-content z-[1] flex flex-col'>
            {state.stops.map((stop) => (
              <li key={stop.id}>
                <Link
                  href={`/stop/${stop.category}/${stop.shortName}`}
                  className='flex flex-row items-center text-lg'>
                  {getIcon(stop)}
                  <div className='grow text-ellipsis max-w-60 overflow-hidden whitespace-nowrap'>
                    {stop.name}
                  </div>
                  <div className='badge capitalize'>{stop.category}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </form>
  )
}

function getIcon(stop: Stop) {
  switch (stop.category) {
    case 'bus':
      return <Bus />
    case 'tram':
      return <Tram />
    case 'other':
      return <Other />
  }
}
