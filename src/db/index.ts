import {closeDb, getCalendars, getStops, openDb} from 'gtfs'

import config from '@/db/config.json'
import {DayNumber, DAY_NAMES, Calendar, Stop, Connection} from '@/lib/types'
import {RouteQuery} from '@/lib/validation'

if (process.env.VERCEL) {
  config.sqlitePath = './gtfs.sqlite'
}

export function connections(query: RouteQuery) {
  const db = openDb(config)
  const near = getStops({stop_lat: query.lat, stop_lon: query.lon}, [], [], {
    // @ts-expect-error
    bounding_box_side_m: query.range,
  }) as Stop[]

  const target = getStops({stop_name: query.stop}) as Stop[]

  const now = Date.now()
  const mid = new Date().setHours(0, 0, 0, 0)
  const current = Math.floor((now - mid) / 1000)
  const daynum = new Date().getDay() as DayNumber

  const [{service_id}] = getCalendars({[DAY_NAMES[daynum]]: 1}) as Calendar[]

  const stmt = db.prepare(
    `SELECT 
      t.trip_id AS id,
      r.route_type AS type,
      r.route_short_name AS route,
      sa.stop_name AS stop,
      sa.stop_lon AS lon_a,
      sa.stop_lat AS lat_a,
      sb.stop_lon AS lon_b,
      sb.stop_lat AS lat_b,
      t.trip_headsign AS headsign,
      (a.arrival_timestamp - @current) * 1000 AS estimated,
      (POW((sa.stop_lon - @lon), 2) + POW((sa.stop_lat - @lat), 2) * 10000000) AS distance
     FROM stop_times AS a
     JOIN stop_times b ON b.trip_id = a.trip_id AND b.stop_id = @b
     JOIN stops sa ON sa.stop_id = a.stop_id
     JOIN stops sb ON sb.stop_id = b.stop_id
     JOIN trips t ON t.trip_id = a.trip_id AND t.service_id = @service_id
     JOIN routes r ON r.route_id = t.route_id
     WHERE a.stop_id = @a
     AND a.stop_sequence < b.stop_sequence
     AND a.arrival_timestamp > @current
     AND a.arrival_timestamp < @current + 3600`,
  )

  const transaction = db.transaction((ids: string[]) =>
    ids.flatMap(([a, b]) =>
      stmt.all({a, b, current, service_id, lat: query.lat, lon: query.lon}),
    ),
  ) as (stops: string[][]) => Connection[]

  const result = transaction(
    near.flatMap((a) => target.map((b) => [a.stop_id, b.stop_id])),
  ).sort((a, b) => a.estimated - b.estimated)

  closeDb(db)

  return result
}
