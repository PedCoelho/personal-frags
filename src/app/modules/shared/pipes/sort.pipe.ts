import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  pure: true,
  standalone: true,
  name: 'sortObjectsBy',
})
export class SortPipe implements PipeTransform {
  //todo untested
  transform<T>(value: T[], prop: keyof T): any {
    console.log(value, prop);
    const regexNumbers = (v: string) => Number(v.match(/[0-9]*\.?[0-9]*/)![0]);
    return value.sort(
      (a, b) =>
        regexNumbers(b[prop] as string) - regexNumbers(a[prop] as string)
    );
  }
}
