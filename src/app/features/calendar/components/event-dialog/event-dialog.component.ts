import { Subscription } from "rxjs";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

import { Component, Inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";

import { CalendarEvent } from "@interfaces/event.interface";

import { isFormValueRequired, parse24HourTimeString } from "@utils/helpers";
import { EMPTY_STRING } from "@utils/constants";

export type EventDialogDataType = { event: CalendarEvent } | { date: Date };

@Component({
  selector: "cal-event-dialog",
  templateUrl: "./event-dialog.component.html",
  styleUrl: "./event-dialog.component.scss",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
  ],
  standalone: true,
})
export class EventDialogComponent implements OnDestroy {
  public eventForm!: FormGroup;
  public minEndDate: Date | null = null;

  private startControlSub?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EventDialogComponent, CalendarEvent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: EventDialogDataType,
  ) {
    this.initializeForm();
  }

  public ngOnDestroy(): void {
    this.startControlSub?.unsubscribe();
  }

  public save(): void {
    if (!this.eventForm.valid) return;

    const formValues = this.eventForm.value;
    const start = new Date(formValues.start).applyHoursAndMinutes(parse24HourTimeString(formValues.startTime));
    const end = new Date(formValues.end).applyHoursAndMinutes(parse24HourTimeString(formValues.endTime));
    const event: CalendarEvent = { ...formValues, start, end };

    this.dialogRef.close(event);
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public isRequired(controlName: string): boolean {
    return isFormValueRequired(this.eventForm, controlName);
  }

  private initializeForm(): void {
    const { event, date } = this.data as { event: CalendarEvent; date: Date };
    const { id = null, title = EMPTY_STRING, description = EMPTY_STRING, start = date, end = date } = { ...event };

    const form = (this.eventForm = this.fb.group({
      id: [id],
      title: [title, Validators.required],
      description: [description],
      start: [start, Validators.required],
      startTime: [start.to24HourTimeString(), Validators.required],
      end: [end, Validators.required],
      endTime: [end.addOneHour().to24HourTimeString(), Validators.required],
    }));

    this.minEndDate = new Date(start);

    this.startControlSub = form.get("start")?.valueChanges.subscribe((start) => {
      if (!start) return;

      this.minEndDate = new Date(start.addOneHour());

      const endControl = form.get<any>("end");

      if (endControl && endControl.value < this.minEndDate) endControl.setValue(this.minEndDate);
    });
  }
}
