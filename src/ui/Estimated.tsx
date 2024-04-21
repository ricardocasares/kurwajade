import ms from 'ms'

export type Estimated = {timestamp: number}
export function Estimated(props: Estimated) {
  const [time, unit] = ms(props.timestamp, {long: true}).split(' ')

  return (
    <div className='flex flex-col items-center'>
      <p className='text-3xl font-semibold'>{time}</p>
      <p className='text-xs'>{unit}</p>
    </div>
  )
}
