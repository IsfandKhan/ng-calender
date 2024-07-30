import { isObservable, of, map, startWith, catchError, Observable } from "rxjs";

import { Pipe, PipeTransform } from "@angular/core";
import { AsyncPipe } from "@angular/common";

@Pipe({
  name: "withLoading",
  standalone: true,
})
export class WithLoadingPipe implements PipeTransform {
  constructor(private asyncPipe: AsyncPipe) {}
  transform<T>(obs: Observable<T>): any {
    return this.asyncPipe.transform(
      isObservable(obs)
        ? obs.pipe(
            startWith({ loading: true }),
            map((value: any) => ({ loading: false, value })),
            catchError((error) => of({ loading: false, error })),
          )
        : obs,
    );
  }
}
