export const formatTimeSlot = (
  date: Date,
  startHour: number,
  duration: number,
): string => {
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(start);
  end.setHours(startHour + duration, 0, 0, 0);

  const formatTime = (time: Date) => time.toISOString().slice(11, 16);

  return `${formatTime(start)} - ${formatTime(end)}`;
};
