import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  pure: true,
  standalone: true,
  name: 'propsToString',
})
export class StringifyPropertyPipe implements PipeTransform {
  transform<T>(value: T[] | undefined, prop: keyof T, separator?: string): any {
    if (!value) return;
    return value.map((x) => x[prop]).join(separator ?? ', ');
  }
}
