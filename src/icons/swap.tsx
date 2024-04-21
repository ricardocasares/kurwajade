import {SVGProps} from 'react'

export function SwapArrows(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='m3 16l4 4l4-4m-4 4V4m14 4l-4-4l-4 4m4-4v16'></path>
    </svg>
  )
}
