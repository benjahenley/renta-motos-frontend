export interface Reservation {
  id: string;
  date: Date;
  userId: string;
  userFullName: string;
  adults: number;
  startTime: string;
  endTime: string;
  price: number;
  excursion: boolean;
  excursionName: string;
  expirationDate: Date;
  status: string;
}
