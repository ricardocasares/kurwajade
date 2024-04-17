'use server'

import {Transport} from '@/lib/api'
import {selectApiUrl} from '@/lib/fn'

export async function autocomplete(bus: boolean, query: string) {
  return new Transport(selectApiUrl(bus)).query(query)
}

export async function find_near_stops(_: any, form: FormData) {
  const bus = form.get('bus') ?? 'off'
  const stop = form.get('stop')
  const [lat, lng] = form.getAll('coordinates')

  const api = new Transport(selectApiUrl(bus.toString() === 'on'))
  const [target, geo_stops] = await Promise.all([
    api.stop(stop!.toString()),
    api.near(lat.toString(), lng.toString()),
  ])
  const near_stops = await Promise.all(geo_stops.map((s) => api.stop(s.id)))
  const common_routes = target.routes
    .filter((r) =>
      near_stops
        .map((s) => s.routes)
        .flat()
        .map((t) => t.id)
        .includes(r.id),
    )
    .map((r) => r.id)

  const trips = await Promise.all(
    target.actual
      .filter((a) => common_routes.includes(a.routeId))
      .map((a) => api.trip(a.tripId)),
  )

  const trips_to_target = trips
    .filter((t) => {
      const a = t.actual.find((a) =>
        geo_stops.map((s) => s.id).includes(a.stop.shortName),
      )
      const b = t.actual.find((a) => a.stop.shortName === target.stopShortName)

      return !!a && !!b && parseInt(a.stop_seq_num) < parseInt(b.stop_seq_num)
    })
    .map((t) => t.id)

  return near_stops
    .map((s) => ({
      ...s,
      actual: s.actual.filter((a) => trips_to_target.includes(a.tripId)),
    }))
    .filter((s) => !!s.actual.length)
}
