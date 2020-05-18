import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replacePipe'
})
export class ReplacePipe implements PipeTransform {

  public transform(value: string, searchValue: string, replaceValue: string): string {
    if (value.trim() === '' || searchValue.trim() === '') {
      return value;
    } else {
      return value.replace(searchValue, replaceValue);
    }
  }
}
