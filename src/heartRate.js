/** Average heart rate across a session's samples. */
export function averageHeartRate(samples) {
  const total = samples.reduce((acc, s) => acc + s.bpm);
  return Math.round(total / samples.length);
}
