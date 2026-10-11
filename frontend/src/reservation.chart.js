/** Preserve actual capture-time spacing, including gaps between recordings. */
export function reservationChart(points, width = 600, height = 90) {
  if (points.length === 0) return null;
  const timestamps = points.map((point) => Date.parse(point.capturedAt));
  const start = Math.min(...timestamps);
  const end = Math.max(...timestamps);
  const fraction = (value) => Math.max(0, Math.min(1, value));
  const coordinates = points.map((point, index) => ({
    x: end === start ? width / 2 : (timestamps[index] - start) / (end - start) * width,
    cpuY: height * (1 - fraction(point.cpuUtilization)),
    memoryY: height * (1 - fraction(point.memoryUtilization)),
  }));
  const path = (key) => coordinates.map((point, index) =>
    `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point[key].toFixed(1)}`).join(" ");
  return { start, end, coordinates, cpuPath: path("cpuY"), memoryPath: path("memoryY") };
}
