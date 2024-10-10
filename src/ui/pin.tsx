'use client'

import {useFormState} from 'react-dom'

import {Pin} from '@/icons/ping'
import {pinAction} from '@/lib/pinned'

type PinButton = {
  stop: string
}

export function PinButton({stop}: PinButton) {
  const [state, pinStop] = useFormState(pinAction, null)

  return (
    <form action={pinStop}>
      <input name='stop' type='hidden' value={stop} />
      <button className='btn btn-accent btn-sm btn-square'>
        <Pin />
      </button>
    </form>
  )
}
