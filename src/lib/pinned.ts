'use server'

import {cookies} from 'next/headers'

export async function all(): Promise<string[]> {
  const store = cookies()
  try {
    return JSON.parse(store.get('pinned')?.value as string)
  } catch (_) {
    return []
  }
}

export async function pinAction(_: any, form: FormData) {
  const store = cookies()
  const pinned = new Set(await all())
  const stop = form.get('stop')!.toString()

  pinned.add(stop)

  store.set('pinned', JSON.stringify(Array.from(pinned)))
}

export async function unpinAction(_: any, form: FormData) {
  const store = cookies()
  const pinned = await all()
  const remove = form.get('stop')?.toString()

  store.set('pinned', JSON.stringify(pinned.filter((p) => p === remove)))
}
