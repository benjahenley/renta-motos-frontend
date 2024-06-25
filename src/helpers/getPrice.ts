interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  jetskiId: string;
}

function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export const getPrice = (reservationData: any) => {
  const { excursion, excursionName, startTime, endTime, adults } =
    reservationData;
  const start = timeStringToMinutes(startTime);
  const end = timeStringToMinutes(endTime);
  const durationInHours = (end - start) / 60;

  let unitPrice = 0;

  if (excursion) {
    if (excursionName === 'isla-margarita') {
      unitPrice = 180;
    }
    if (excursionName === 'cala-salada') {
      unitPrice = 120;
    }
    if (excursionName === 'cala-comte') {
      unitPrice = 180;
    }
    if (excursionName === 'cala-ubarca') {
      unitPrice = 250;
    }
    if (excursionName === 'portixol') {
      unitPrice = 300;
    }
    if (excursionName === 'isla-es-vedra') {
      unitPrice = 300;
    }
  } else {
    if (durationInHours == 2) {
      unitPrice = 250;
    } else if (durationInHours == 1) {
      unitPrice = 100;
    } else if (durationInHours == 4) {
      unitPrice = 300;
    } else {
      unitPrice = 450;
    }
  }

  const totalPrice = unitPrice * adults;

  return totalPrice;
};