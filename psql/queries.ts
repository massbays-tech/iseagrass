export const Queries = {
  Trips: {
    List: `SELECT * FROM trips WHERE date >= $1 AND date <= $2 ORDER BY date DESC`,
    Fetch: `SELECT * FROM trips WHERE uuid = $1 LIMIT 1`,
    Upsert: `INSERT INTO
      trips (uuid, date, boat, crew, stations, uploaded_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (uuid)
      DO UPDATE SET
        date = $2,
        boat = $3,
        crew = $4,
        stations = $5,
        uploaded_at = $6
      RETURNING *`
  }
}
