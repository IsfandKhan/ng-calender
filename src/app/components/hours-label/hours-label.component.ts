import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cal-hours-label',
  templateUrl: './hours-label.component.html',
  styleUrl: './hours-label.component.scss',
  standalone: true,
})
export class HoursLabelComponent implements OnInit {
  public hours: string[] = [];

  public ngOnInit(): void {
    this.generateHours();
  }

  private generateHours(): void {
    this.hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  }
}
