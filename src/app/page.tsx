import {Other} from '@/icons/other'

export default async function Page() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-2'>
      <Other className='w-24 h-24 text-neutral' />
      <h1 className='text-neutral-content'>
        You don&apos;t have any saved stops
      </h1>
    </div>
  )
}
