import * as v from 'valibot'

export type RouteQuery = v.Input<typeof routeQuery>
export const routeQuery = v.object({
  lat: v.coerce(v.number('Invalid latitude'), Number),
  lon: v.coerce(v.number('Invalid latitude'), Number),
  stop: v.string('Invalid stop name', [v.minLength(2)]),
  range: v.optional(
    v.coerce(
      v.number('Invalid distance', [v.minValue(250), v.maxValue(2000)]),
      Number,
    ),
    1000,
  ),
})

export const parseSearchParams = (data: unknown) =>
  v.safeParse(routeQuery, data)
