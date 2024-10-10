import {db} from '@/lib/db'

export default async function Page() {
  const stops = await db.execute(
    `SELECT stop_name FROM stops GROUP BY stop_name;`,
  )

  return (
    <code>
      <pre>{JSON.stringify(stops, null, 2)}</pre>
    </code>
  )
}
