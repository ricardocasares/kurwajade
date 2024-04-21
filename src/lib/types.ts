export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const DAY_NAMES = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
} as const

export type Stop = {
  stop_id: string
  stop_name: string
  stop_lat: number
  stop_lng: number
}

export type Stoptime = {
  trip_id: string
  stop_id: string
  stop_sequence: number
  arrival_time: string
  arrival_timestamp: number
}

export type Route = {
  stop_id: string
  route_short_name: string
}

export type Trip = {
  trip_id: string
  route_id: string
  trip_headsign: string
}

export type Calendar = {
  service_id: string
}

export type Connection = {
  id: string
  type: number
  stop: string
  route: string
  headsign: string
  lat_a: number
  lon_a: number
  lat_b: number
  lon_b: number
  distance: number
  estimated: number
  arrival_time: string
  arrival_timestamp: number
}
