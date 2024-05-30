export function formatDateToISOWithoutTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
