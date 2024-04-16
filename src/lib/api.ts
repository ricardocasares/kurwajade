export type Stop = {
  category: 'tram' | 'bus'
  id: string
  latitude: number
  longitude: number
  name: string
  shortName: string
}

export type BoxStops = {
  stops: Stop[]
}

export type RouteStop = {
  id: string
  name: string
  number: string
}

export type RouteDetail = {
  authority: string
  directions: [string, string]
  id: string
  name: string
  shortName: string
}

export type RouteStops = {
  route: RouteDetail
  stops: RouteStop[]
}

export type NearbyStop = {
  id: string
  type: 'stop'
  name: string
}

export type Passage = {
  actualRelativeTime: number
  actualTime: string
  plannedTime: string
  direction: string
  patternText: string
  mixedTime: string
  status: 'PREDICTED' | 'PLANNED' | 'DEPARTED'
  routeId: string
  tripId: string
}

export type StopPassage = {
  old: Passage[]
  actual: Passage[]
  routes: RouteDetail[]
  stopName: string
  stopShortName: string
}

export type GroupedStopPassage = Passage & Pick<StopPassage, 'stopName'>

export type TripStops = {
  actualTime: string
  status: 'PLANNED' | 'DEPARTED' | 'PREDICTED'
  stop: {
    id: string
    name: string
    shortName: string
  }
  stop_seq_num: string
}

export type Trip = {
  id: string
  old: TripStops[]
  actual: TripStops[]
  directionText: string
  routeName: string
}

export async function route_stops(routeId: string) {
  const now = Date.now()
  const res = await fetch(
    `http://www.ttss.krakow.pl/internetservice/services/routeInfo/routeStops?routeId=${routeId}&cacheBuster=${now}`,
  )

  const data = (await res.json()) as RouteStops

  return data
}

export async function nearby_stops(lat: string, lng: string) {
  const res = await fetch(
    `http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/nearStops/json?lat=${lat}&lon=${lng}`,
  )

  if (!res.ok) return []

  const stops = (await res.json().catch(() => [])) as NearbyStop[]

  return stops.filter((stop) => stop.type === 'stop').slice(0, 10)
}

export async function get_stop(stop: string) {
  const now = Date.now()
  const res = await fetch(
    `http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?stop=${stop}&cacheBuster=${now}`,
  )

  return (await res.json()) as StopPassage
}

export async function get_trip(id: string) {
  const res = await fetch(
    `http://www.ttss.krakow.pl/internetservice/services/tripInfo/tripPassages?tripId=${id}`,
  )

  const data = (await res.json()) as Trip

  return {...data, id}
}

export async function get_stops() {
  const [left, bottom, right, top] = [
    -648000000, -324000000, 648000000, 324000000,
  ].map(String)

  const url = new URL(
    `http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/stopinfo/stops`,
  )
  const params = new URLSearchParams({
    top,
    left,
    right,
    bottom,
  })

  params.forEach((value, key) => url.searchParams.set(key, value))

  const res = await fetch(url)
  const data = (await res.json()) as BoxStops

  return data.stops.sort((a, b) => a.name.localeCompare(b.name))
}
