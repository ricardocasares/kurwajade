import {get_stops} from '@/lib/api'

export async function Routes(props: {name: string}) {
  const stops = await get_stops()

  return (
    <select name={props.name} className='select select-bordered w-full'>
      <optgroup label='Select line'>
        {stops.map((stop) => (
          <option key={stop.id} value={stop.shortName}>
            {stop.name}
          </option>
        ))}
      </optgroup>
    </select>
  )
}
