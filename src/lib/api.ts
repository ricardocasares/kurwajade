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

export type Box = {top: string; left: string; right: string; bottom: string}
const DEFAULT_BOX: Box = {
  top: '324000000',
  left: '-648000000',
  bottom: '-324000000',
  right: '648000000',
}

export class Transport {
  constructor(private base: string) {}

  async query(query: string) {
    const data = await this.fetch<NearbyStop[]>(
      '/internetservice/services/lookup/autocomplete/json',
      {query},
    )

    return data.filter((s) => s.type === 'stop')
  }

  async near(lat: string, lon: string) {
    const data = await this.fetch<NearbyStop[]>(
      '/internetservice/services/lookup/autocomplete/nearStops/json',
      {lat, lon},
    )

    return data.filter((s) => s.type === 'stop')
  }

  async stop(id: string) {
    return this.fetch<StopPassage>(
      `/internetservice/services/passageInfo/stopPassages/stop`,
      {stop: id},
    )
  }

  async trip(id: string) {
    const data = await this.fetch<Trip>(
      '/internetservice/services/tripInfo/tripPassages',
      {
        tripId: id,
      },
    )

    return {...data, id}
  }

  async stops(box: Box = DEFAULT_BOX) {
    const data = await this.fetch<BoxStops>(
      '/internetservice/geoserviceDispatcher/services/stopinfo/stops',
      box,
    )

    return data.stops.sort((a, b) =>
      a.name.localeCompare(b.name, 'en', {numeric: true}),
    )
  }

  private async fetch<T>(path: string, query: Record<string, string> = {}) {
    const now = Date.now()
    const url = new URL(path, this.base)

    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v))

    url.searchParams.append('cacheBuster', now.toString())

    const res = await fetch(url)

    return res.json() as T
  }
}
