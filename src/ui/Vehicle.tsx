import {match} from 'ts-pattern'

import {Bus} from '@/icons/bus'
import {Ticket} from '@/icons/ticket'
import {Tram} from '@/icons/tram'

export type Vehicle = {
  type: number
  route: string
  headsign: string
}
export function Vehicle(props: Vehicle) {
  const icon = match(props.type)
    .with(3, () => <Bus className='w-5 h-5 text-primary' />)
    .with(900, () => <Tram className='w-5 h-5 text-primary' />)
    .otherwise(() => <Ticket className='w-5 h-5 text-primary' />)

  return (
    <div className='flex gap-2 items-center'>
      <span className='text-xs uppercase text-nowrap max-w-48 sm:max-w-md md:max-w-md lg:max-w-lg text-ellipsis overflow-hidden'>
        {props.headsign}
      </span>
      {icon}
      <span className='font-semibold text-sm bg-neutral text-neutral-content px-2 rounded'>
        {props.route}
      </span>
    </div>
  )
}
