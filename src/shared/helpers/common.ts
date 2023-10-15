import dayjs from 'dayjs';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomDate() {
  const today = dayjs();
  const minDate = today.subtract(180, 'day');
  const diffDays = Math.floor(Math.random() * 180);
  return minDate.add(diffDays, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
}
