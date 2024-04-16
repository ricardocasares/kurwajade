'use server'

import {get_stop, get_trip, nearby_stops} from '@/lib/api'

export async function find_near_stops(_: any, form: FormData) {
  const stop = form.get('stop')
  const [lat, lng] = form.getAll('coordinates')
  const [target, geo_stops] = await Promise.all([
    get_stop(stop!.toString()),
    nearby_stops(lat.toString(), lng.toString()),
  ])
  const near_stops = await Promise.all(geo_stops.map((s) => get_stop(s.id)))
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
      .map((a) => get_trip(a.tripId)),
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
