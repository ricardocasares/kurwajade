'use server'

import cfg from '@/lib/config'

const STOPS = [
  'internetservice',
  'geoserviceDispatcher',
  'services',
  'stopinfo',
  'stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000',
].join('/')

const PASSAGES = [
  'internetservice',
  'services',
  'passageInfo',
  'stopPassages',
  'stop?mode=departure',
].join('/')

export type Stop = {
  id: string
  name: string
  shortName: string
  category: 'bus' | 'tram' | 'other'
  latitude: number
  longitude: number
}

export type Stops = {stops: Stop[]}
export type Passage = {
  routeId: string
  vehicleId: string
  actualRelativeTime: number
  actualTime: string
  direction: string
  mixedTime: string
  plannedTime: string
  patternText: string
  status: 'PREDICTED' | 'PLANNED' | 'DELAYED' | 'DEPARTED' | 'STOPPING'
}
export type Route = {
  alerts: string[]
  routeType: 'bus' | 'tram'
  directions: string[]
  shortName: string
}
export type StopPassages = {
  old: Passage[]
  routes: Route[]
  actual: Passage[]
  directions: string[]
  stopName: string
  stopShortName: string
}
export type AutoCompleteState = {query: string; stops: Stop[]}

export async function getPassages(
  stop: string,
  base: string,
): Promise<StopPassages> {
  const url = new URL(PASSAGES, base)
  url.searchParams.append('stop', stop)
  const res = await fetch(url, {cache: 'no-store'})

  return res.json()
}

async function getStops(url: URL): Promise<Stops> {
  const res = await fetch(url, {
    next: {revalidate: 172_800},
  })

  return res.json()
}

export async function autocompleteAction(
  _: AutoCompleteState,
  form: FormData,
): Promise<AutoCompleteState> {
  const query = form.get('query')!.toString()
  const url = new URL(STOPS, cfg.BUS_URL)
  console.log(url.href)
  const {stops: bus} = await getStops(url)
  const {stops: trams} = await getStops(new URL(STOPS, cfg.TRAM_URL))
  const stops = [...bus, ...trams]
    .filter(({name}) => name.toLowerCase().includes(query?.toLowerCase()))
    .sort((a, b) => a.name.length - b.name.length)

  return {query, stops}
}
