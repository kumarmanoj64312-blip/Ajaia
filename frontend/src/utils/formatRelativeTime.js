const UNITS = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  if (seconds < 45) return 'just now';

  for (const [unit, secondsInUnit] of UNITS) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}
