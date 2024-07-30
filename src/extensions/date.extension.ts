Date.prototype.applyHoursAndMinutes = function (date: Date): Date {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate(), date.getHours(), date.getMinutes());
};

Date.prototype.to24HourTimeString = function (): string {
  const hours = String(this.getHours()).padStart(2, '0');
  const minutes = String(this.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

Date.prototype.addOneHour = function (): Date {
  return new Date(this.getTime() + 60 * 60 * 1000);
};
