import {Other} from '@/icons/other'

export default async function Page() {
  return (
    <div className='h-screen bg-base-200 flex flex-col items-center justify-center gap-2'>
      <Other className='w-24 h-24 text-success' />
      <h1 className='text-neutral-content'>You don't have any saved stops</h1>
    </div>
  )
}
