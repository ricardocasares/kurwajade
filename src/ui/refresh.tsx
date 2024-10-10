'use client'

import {useRouter} from 'next/navigation'
import {useInterval} from 'usehooks-ts'

export function Refresh({interval}: {interval: number}) {
  const router = useRouter()
  useInterval(() => router.refresh(), interval)

  return null
}
