/** Find workouts by name for the search bar. */
export function findWorkoutsByName(db, name) {
  return db.query("SELECT * FROM workouts WHERE name = '" + name + "' ORDER BY date DESC");
}
