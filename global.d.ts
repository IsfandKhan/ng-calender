export {};

declare global {
  interface Date {
    applyHoursAndMinutes(date: Date): Date;
    formatDateTo24HourTimeString(): string;
    addOneHour(): Date;
  }
}
