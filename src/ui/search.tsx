'use client'

import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'
import {useFormState} from 'react-dom'
import {useOnClickOutside} from 'usehooks-ts'

import {Bus} from '@/icons/bus'
import {Other} from '@/icons/other'
import {Tram} from '@/icons/tram'
import {Zoom} from '@/icons/zoom'
import {autocompleteAction, type Stop, type AutoCompleteState} from '@/lib/api'

const initial: AutoCompleteState = {
  query: '',
  stops: [],
}

export function Search() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(autocompleteAction, initial)
  const shouldOpen = state.query.length > 0 && state.stops.length > 0

  useOnClickOutside(ref, () => setOpen(false))

  useEffect(() => {
    setOpen(shouldOpen)
  }, [shouldOpen])

  return (
    <form action={formAction}>
      <details
        open={open}
        className='dropdown w-full dropdown-hover appearance-none'>
        <summary className='appearance-none list-none'>
          <label htmlFor='' className='input input-bordered flex items-center'>
            <input
              onFocus={() => setOpen(shouldOpen)}
              type='text'
              name='query'
              className='grow'
              autoComplete='off'
              placeholder='Search for a stop'
            />
            <Zoom />
          </label>
        </summary>
        <div
          ref={ref}
          className='dropdown-content w-full max-h-64 overflow-scroll rounded-lg shadow-xl mt-2'
          onClick={() => {}}>
          <ul className='menu bg-accent text-accent-content z-[1] flex flex-col'>
            {state.stops.map((stop) => (
              <li key={stop.id} onClick={() => setOpen(!open)}>
                <Link
                  href={`/stop/${stop.category}/${stop.shortName}`}
                  className='flex flex-row items-center text-lg'>
                  {getIcon(stop)}
                  <div className='grow'>
                    <h2 className='text-ellipsis max-w-60 overflow-hidden whitespace-nowrap'>
                      {stop.name}
                    </h2>
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
