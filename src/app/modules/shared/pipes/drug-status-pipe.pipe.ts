import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'drugStatusPipe'
})
export class DrugStatusPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value.toLowerCase() === 'approved') {
      return `<span class="drug-status-approved">${value}</span>`;
    } else {
      return value;
    }
  }
}
