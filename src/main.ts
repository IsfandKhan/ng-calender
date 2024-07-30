/// <reference path="../global.d.ts" />

import { bootstrapApplication } from "@angular/platform-browser";

import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

import "./extensions/date.extension";

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
