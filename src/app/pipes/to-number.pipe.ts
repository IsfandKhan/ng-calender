import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toNumber",
  standalone: true,
})
export class ToNumberPipe implements PipeTransform {
  transform(value: any): number {
    return Number(value);
  }
}
