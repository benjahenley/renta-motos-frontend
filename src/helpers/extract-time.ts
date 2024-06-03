export function extractTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const hours = dateObj.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
