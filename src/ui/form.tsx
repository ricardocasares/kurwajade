'use client'

import {useDebounce, useGeolocation} from '@uidotdev/usehooks'
import cc from 'classcat'
import ms from 'ms'
import {useRouter} from 'next/navigation'
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {P, match} from 'ts-pattern'

import {Bus} from '@/icons/bus'
import {Tram} from '@/icons/tram'
import {autocomplete, find_near_stops} from '@/lib/actions'
import type {NearbyStop, Stop, StopPassage} from '@/lib/api'

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const status = useFormStatus()

  return (
    <button
      {...props}
      className={`btn btn-neutral ${props.className}`}
      disabled={status.pending || props.disabled}>
      {props.children}
    </button>
  )
}

type Select = SelectHTMLAttributes<HTMLSelectElement> & {stops: Stop[]}
const Select = ({stops, ...props}: Select) => (
  <select
    {...props}
    className={`select select-bordered w-full ${props.className}`}>
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

export function Form() {
  const router = useRouter()
  const geo = useGeolocation()
  const [bus, setBus] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [stop, setStop] = useState<null | NearbyStop>(null)
  const [stops, setStops] = useState<NearbyStop[]>([])
  const [state, action] = useFormState(find_near_stops, null)
  const loading = geo.loading ? 'Acquiring GPS...' : 'Search'

  useEffect(() => {
    !!debouncedQuery && autocomplete(bus, debouncedQuery).then(setStops)
  }, [bus, debouncedQuery])

  const result = match(state)
    .returnType<ReactNode>()
    .with(null, () => <NotAsked />)
    .with(P.array(P.nullish), () => <NoResults />)
    .with(P.array(P.not(P.nullish)), (state) => <Passages passages={state} />)
    .exhaustive()

  return (
    <div>
      <form action={action} className='flex flex-col gap-2 p-2'>
        <div className='flex gap-2 items-center'>
          <div
            className={cc([
              {
                'dropdown': stops.length > 0,
                'dropdown-open': !stop && stops.length > 0,
              },
              'dropdown w-full grow',
            ])}>
            <input
              type='text'
              className='input input-bordered w-full'
              placeholder={`Search for a ${bus ? 'bus' : 'tram'} stop`}
              value={query}
              onChange={async (e) => {
                setStop(null)
                setQuery(e.target.value)
              }}
            />
            <div
              tabIndex={0}
              className='dropdown-content z-10 w-full bg-neutral drop-shadow-xl'>
              {!stop && query && stops.length > 0 && (
                <ul className='menu menu-compact'>
                  {stops.map((s) => (
                    <li key={s.id}>
                      <button
                        type='button'
                        onClick={() => {
                          setStop(s)
                          setQuery(s.name)
                        }}>
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <input type='hidden' name='stop' defaultValue={stop?.id} />
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
        <div className='flex gap-2'>
          <Button disabled={geo.loading || !stop?.id} className='grow'>
            {loading}
          </Button>
          <Button
            disabled={!state}
            onClick={() => router.refresh()}
            className='grow'>
            Refresh
          </Button>
          <label className='swap btn btn-neutral'>
            <input
              type='checkbox'
              name='bus'
              defaultChecked={bus}
              onChange={() => {
                setBus(!bus)
                setStop(null)
                setQuery('')
              }}
            />
            <div className='swap-on'>
              <Bus className='w-8 h-8' />
            </div>
            <div className='swap-off'>
              <Tram className='w-8 h-8' />
            </div>
          </label>
        </div>
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
