import {SVGProps} from 'react'

export function Tram(props: SVGProps<SVGSVGElement>) {
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
        <rect width='16' height='16' x='4' y='3' rx='2'></rect>
        <path d='M4 11h16m-8-8v8m-4 8l-2 3m12 0l-2-3m-8-4h.01M16 15h.01'></path>
      </g>
    </svg>
  )
}
