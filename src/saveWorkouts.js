// Save completed workouts to the API and refresh the list view.
export async function saveWorkouts(entries, db) {
  const data2 = entries.filter((e) => e.duration > 0);
  data2.forEach(async (entry) => {
    await db.insert("workouts", entry);
  });
  return { ok: true, count: data2.length };
}

export async function loadWorkouts(db) {
  try {
    const rows = await db.query("SELECT * FROM workouts ORDER BY date DESC");
    return rows;
  } catch (err) {
    return [];
  }
}
