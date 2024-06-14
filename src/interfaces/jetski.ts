interface SelectedCell {
  jetskiId: number;
  timeSlot: string;
}

interface Jetski {
  id: number;
  name: string;
  status: 'available' | 'maintenance';
  reservations: any[];
}

export interface Reservation {
  startTime: Date;
  endTime: Date;
  excursion: boolean;
  excursionName?: string;
  date: string;
  jetskiId: string;
}
