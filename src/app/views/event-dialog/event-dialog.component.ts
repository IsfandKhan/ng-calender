import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ICalendarEvent } from '@interfaces/event.interface';

@Component({
  selector: 'cal-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrl: './event-dialog.component.scss',
  imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  standalone: true,
})
export class EventDialogComponent {
  public eventForm!: FormGroup;
  public minEndDate: Date | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: { event: ICalendarEvent } & { date: Date },
  ) {
    this.initializeForm();
  }

  public save(): void {
    if (this.eventForm.valid) this.dialogRef.close(this.eventForm.value);
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      id: [this.data.event?.id || null],
      title: [this.data.event?.title || '', Validators.required],
      description: [this.data.event?.description || ''],
      start: [this.data.event?.start || this.data.date, Validators.required],
      end: [this.data.event?.end || new Date(this.data.date.getTime() + 60 * 60 * 1000), Validators.required],
    });

    if (this.data.event?.start) this.minEndDate = new Date(this.data.event.start.getTime() + 60 * 60 * 1000);
    else this.minEndDate = new Date(this.data.date.getTime() + 60 * 60 * 1000);

    this.eventForm.get('start')?.valueChanges.subscribe((start) => {
      if (!start) return;

      this.minEndDate = new Date(start.getTime() + 60 * 60 * 1000);
      const endControl = this.eventForm.get('end');

      if (endControl && endControl.value < this.minEndDate) endControl.setValue(this.minEndDate);
    });
  }
}
