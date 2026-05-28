export const WHEEL_COLORS = [
  '#FF2A54', // Neon Red/Pink
  '#00B8FF', // Cyan
  '#FFD439', // Bright Yellow
  '#7A5CFF', // Electric Indigo
  '#00D186', // Emerald
  '#FF7E40', // Neon Orange
  '#D838FF', // Fuchsia
  '#3091FF', // Blue
  '#84E030', // Lime
  '#FF4B8B', // Rose
  '#B34FFF', // Purple
  '#FF9C2A', // Amber
]

export function getSegmentColor(index, totalSegments = 0) {
  let colorIndex = index % WHEEL_COLORS.length;
  // Prevent the last segment from being the exact same color as the first segment
  if (totalSegments > 1 && index === totalSegments - 1 && colorIndex === 0) {
    colorIndex = 1;
  }
  return WHEEL_COLORS[colorIndex];
}
