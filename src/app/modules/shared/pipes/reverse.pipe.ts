import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  pure: true,
  standalone: true,
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any {
    return value.reverse();
  }
}
