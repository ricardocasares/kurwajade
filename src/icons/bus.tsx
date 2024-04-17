import {SVGProps} from 'react'

export function Bus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}>
      <g
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'>
        <path d='M4 6L2 7m8-1h4m8 1l-2-1'></path>
        <rect width='16' height='16' x='4' y='3' rx='2'></rect>
        <path d='M4 11h16M8 15h.01M16 15h.01M6 19v2m12 0v-2'></path>
      </g>
    </svg>
  )
}
