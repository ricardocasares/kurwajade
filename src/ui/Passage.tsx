import {ArrowRight} from '@/icons/arrow.right'
import {Walk} from '@/icons/walk'
import {Estimated} from '@/ui/Estimated'
import {Vehicle} from '@/ui/Vehicle'

export type Passage = Vehicle &
  Estimated & {
    stop: string
  }
export function Passage(props: Passage) {
  return (
    <div className='flex gap-2 p-3 items-center rounded-lg bg-base-100 shadow-lg'>
      <Estimated timestamp={props.timestamp} />
      <div className='flex flex-col items-end gap-1 grow'>
        <Vehicle
          type={props.type}
          route={props.route}
          headsign={props.headsign}
        />
        <div className='flex gap-1 items-center'>
          <Walk className='w-4 h-4' /> <ArrowRight className='w-4 h-4' />
          <div className='text-nowrap text-xl text-ellipsis overflow-hidden font-normal max-w-64 sm:max-w-md md:max-w-md lg:max-w-lg'>
            {props.stop}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Skeleton = () => (
  <div className='flex gap-2 p-3 items-center rounded-lg bg-base-100 shadow-lg'>
    <div className='w-12 h-12 skeleton rounded-lg'></div>
    <div className='grow'></div>
    <div className='flex flex-col items-end gap-3'>
      <div className='w-48 h-4 skeleton'></div>
      <div className='w-64 h-6 skeleton'></div>
    </div>
  </div>
)
