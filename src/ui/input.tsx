'use client'

import cc from 'classcat'
import {useSearchParams, useRouter} from 'next/navigation'
import {useState} from 'react'

import {Gps} from '@/icons/gps'

const sleep = (n: number) =>
  new Promise((r) => {
    setTimeout(r, n)
  })

type State = 'off' | 'acquiring' | 'fixed' | 'error'
const colorMap: Record<State, string> = {
  off: 'text-base-content',
  error: 'text-error',
  fixed: 'text-success',
  acquiring: 'text-warning animate-pulse',
}

export function Input() {
  const router = useRouter()
  const [state, setState] = useState<State>('fixed')
  const [query, setQuery] = useState<string>('')
  const [list] = useState<string[]>(
    Array(1000)
      .fill('0')
      .map((v, i) => v + i),
  )
  const disabled = ['off', 'error', 'acquiring'].includes(state)
  const placeholder = disabled
    ? 'Waiting for GPS signal ...'
    : 'Enter destination'
  const filter = query.length
    ? list
        .filter((x) => x.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
    : list.slice(0, 4)

  const open = query.length > 0 && filter.length

  const onClick = async () => {
    setState('acquiring' satisfies State)
    await sleep(1000)
    setState('error' satisfies State)
    await sleep(1000)
    setState('acquiring' satisfies State)
    await sleep(3000)
    setState('fixed' satisfies State)
  }

  return (
    <form action='?test=1'>
      <label
        className={cc([
          {'input-disabled': disabled},
          'input input-md flex gap-2 items-center shadow',
        ])}>
        <div className={cc([{'dropdown-open': open}, 'dropdown grow'])}>
          <input
            type='text'
            disabled={disabled}
            placeholder={placeholder}
            className={cc([{disabled: disabled}, 'w-full'])}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='dropdown-content w-full max-h-64 overflow-scroll rounded-lg'>
            <ul
              tabIndex={0}
              className={cc([
                {hidden: !open},
                'menu bg-accent text-accent-content z-[1] shadow-xl flex flex-col',
              ])}>
              {filter.map((item, idx) => (
                <li key={idx}>
                  <a>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {disabled && (
          <span className='loading loading-spinner loading-xs'></span>
        )}
        <button onClick={onClick} className={colorMap[state]}>
          <Gps className='w-5 h-5' />
        </button>
      </label>
    </form>
  )
}
