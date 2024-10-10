import cn from 'classcat'
import ms from 'ms'

import {type Passage as PassageProps} from '@/lib/api'

export function Passage({passage}: {passage: PassageProps}) {
  return (
    <div className='flex items-center gap-2 rounded p-2 bg-base-100 border border-neutral'>
      <div className='font-mono flex items-center justify-center text-xl tabular-nums font-bold p-3 bg-accent text-accent-content rounded min-w-16'>
        {passage.patternText}
      </div>
      <div className='grow'>
        <h2 className='w-48 sm:w-96 md:w-full text-ellipsis whitespace-nowrap overflow-hidden'>
          {passage.direction}
        </h2>
        <h3 className='font-mono text-xs text-neutral-content'>
          {passage.status} {passage.plannedTime}
        </h3>
      </div>
      <div
        className={cn([
          {
            'text-success': ['PLANNED', 'PREDICTED', 'STOPPING'].includes(
              passage.status,
            ),
            'animate-pulse': passage.status === 'STOPPING',
            'text-neutral-content': passage.status === 'DEPARTED',
          },
          'w-16 text-center font-bold tabular-nums',
        ])}>
        {ms(passage.actualRelativeTime * 1000)}
      </div>
    </div>
  )
}
