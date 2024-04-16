'use client'

import {useGeolocation, useVisibilityChange} from '@uidotdev/usehooks'
import ms from 'ms'
import {useRouter} from 'next/navigation'
import {ReactNode, useEffect} from 'react'
import {useFormState} from 'react-dom'

import {find_near_stops} from '@/lib/actions'
import type {StopPassage} from '@/lib/api'

export type Form = {
  to: ReactNode
}

export function Form(props: Form) {
  const router = useRouter()
  const focus = useVisibilityChange()
  const geo = useGeolocation()
  const [state, action] = useFormState(find_near_stops, null)
  const loading = geo.loading ? (
    <span className='loading loading-infinity loading-md'></span>
  ) : (
    'Submit'
  )

  useEffect(() => {
    router.refresh()
  }, [focus, router])

  return (
    <div>
      <form action={action} className='flex flex-col gap-2 p-2'>
        {props.to}
        <input
          type='hidden'
          name='coordinates'
          defaultValue={geo.latitude ?? '50.063537290857916'}
          className='input input-bordered'
        />
        <input
          type='hidden'
          name='coordinates'
          defaultValue={geo.longitude ?? '50.063537290857916'}
          className='input input-bordered'
        />
        <button className='btn btn-neutral' disabled={geo.loading}>
          {loading}
        </button>
      </form>
      <hr className='border-neutral' />
      {state && <Passages passages={state} />}
    </div>
  )
}

export function Passages(props: {passages: StopPassage[]}) {
  return (
    <div className='divide-y divide-neutral'>
      {props.passages.map((p) => (
        <div
          key={p.stopShortName}
          className='flex items-center gap-2 p-2 justify-start'>
          <div className='text-md grow text-ellipsis text-nowrap overflow-hidden'>
            {p.stopName}
          </div>
          <div className='flex gap-2'>
            {p.actual.map((r) => (
              <div key={r.tripId} className='flex flex-col'>
                <span className='text-xs stat-title text-neutral-content'>
                  {ms(r.actualRelativeTime * 1000)}
                </span>
                <span className='text-2xl text-neutral-content tabular-nums'>
                  {r.patternText}
                </span>
                <div
                  className='text-center text-xs text-secondary w-8 text-nowrap text-ellipsis overflow-hidden'
                  title={r.direction}>
                  {r.direction}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
