import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cal-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
  standalone: true,
})
export class AppComponent {
  title = 'ng-calender-app';
}
