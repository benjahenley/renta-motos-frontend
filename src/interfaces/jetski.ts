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
  id: string;
  date: Date;
  price: number;
  adults: number;
  userFullName: string;
  excursionName: string;
  startTime: string;
  excursion: boolean;
  endTime: string;
  userId: string;
  expirationDate: Date;
  status: string;
}
