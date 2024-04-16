'use client'

import {useGeolocation} from '@uidotdev/usehooks'
import ms from 'ms'
import {useRouter} from 'next/navigation'
import type {ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {P, match} from 'ts-pattern'

import {find_near_stops} from '@/lib/actions'
import type {Stop, StopPassage} from '@/lib/api'

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const status = useFormStatus()

  return (
    <button
      className='btn btn-neutral'
      {...props}
      disabled={status.pending || props.disabled}>
      {props.children}
    </button>
  )
}

type Select = SelectHTMLAttributes<HTMLSelectElement> & {stops: Stop[]}
const Select = ({stops, ...props}: Select) => (
  <select className='select select-bordered w-full' {...props}>
    <optgroup label='Select line'>
      {stops.map((stop) => (
        <option key={stop.id} value={stop.shortName}>
          {stop.name}
        </option>
      ))}
    </optgroup>
  </select>
)

const NotAsked = () => (
  <div className='flex items-center justify-center h-96'>
    Select your destination!
  </div>
)

const NoResults = () => (
  <div className='flex items-center justify-center h-96'>No results :(</div>
)

export type Form = {
  stops: Stop[]
}
export function Form(props: Form) {
  const router = useRouter()
  const geo = useGeolocation()
  const [state, action] = useFormState(find_near_stops, null)
  const loading = geo.loading ? 'Acquiring GPS...' : 'Search'

  const result = match(state)
    .returnType<ReactNode>()
    .with(null, () => <NotAsked />)
    .with(P.array(P.nullish), () => <NoResults />)
    .with(P.array(P.not(P.nullish)), (state) => <Passages passages={state} />)
    .exhaustive()

  return (
    <div>
      <form action={action} className='flex flex-col gap-2 p-2'>
        <Select name='stop' stops={props.stops} />
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
        <Button disabled={geo.loading}>{loading}</Button>
        {state && state.length > 0 && (
          <Button onClick={() => router.refresh()}>Refresh</Button>
        )}
      </form>
      <hr className='border-neutral' />
      {result}
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
