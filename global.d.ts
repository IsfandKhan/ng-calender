export {};

declare global {
  interface Date {
    applyHoursAndMinutes(date: Date): Date;
    to24HourTimeString(): string;
    addOneHour(): Date;
  }
}
