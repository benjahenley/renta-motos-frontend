import { getJetskis } from '@/api/get-jetskis/useGetJetskis';
import { extractTime } from './extract-time';

export let timeSlots = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export const jetskiData = async () => {
  try {
    const { jetskis } = await getJetskis();
    const availableJetskis = jetskis.filter(
      (jetski: { available: boolean }) => jetski.available,
    );
    return availableJetskis;
  } catch (error) {
    console.error('Error fetching jetskis:', error);
    return [];
  }
};

export function getCellsToSelect(rentTime: string): number {
  const rentTimeMapping: { [key: string]: number } = {
    fullDay: 16,
    '4h': 8,
    '2h': 4,
    '1.5h': 3,
    '1h': 2,
    '30m': 1,
  };

  return rentTimeMapping[rentTime] || 0;
}

export function getMatrixTemplate(): number[][] {
  return Array.from({ length: timeSlots.length }, () => Array(4).fill(0));
}

export function getGuidesTemplate() {
  return timeSlots.map(() => 0);
}

export const getHistoryTemplate = (): number[] => {
  return timeSlots.map(() => 0);
};

export const populateMatrix = (rows: number | number[], col: number) => {
  const newMatrix = getMatrixTemplate();
  if (Array.isArray(rows)) {
    rows.forEach((row) => {
      newMatrix[row][col] = 1;
    });
  } else {
    newMatrix[rows][col] = 1;
  }

  return newMatrix;
};

export const findTimezoneIndexes = (
  startTime: Date,
  endTime: Date,
): number[] => {
  const start = extractTime(startTime);
  const end = extractTime(endTime);
  let indexes: number[] = [];

  for (let i = 0; i < timeSlots.length; i++) {
    const shiftStartTime = timeSlots[i];
    if (shiftStartTime >= start && shiftStartTime <= end) {
      indexes.push(i);
    }
  }

  return indexes;
};

export const getJetskisAndExcursionsTemplate = (): [number, string[]][] => {
  const template: [number, string[]][] = [];

  timeSlots.forEach(() => template.push([0, []]));
  return template;
};
