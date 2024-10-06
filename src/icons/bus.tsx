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
        <path d='M8 6v6m7-6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3'></path>
        <circle cx='7' cy='18' r='2'></circle>
        <path d='M9 18h5'></path>
        <circle cx='16' cy='18' r='2'></circle>
      </g>
    </svg>
  )
}
