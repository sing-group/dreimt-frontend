import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'pvalueNumberPipe'
})
export class PvalueNumberPipePipe extends DecimalPipe {

  transform(value: number, args?: any): any {
    if (value < 0.0000001) {
      return '< 10e-08';
    } else if (value < 0.000001) {
      return '< 10e-07';
    } else if (value < 0.00001) {
      return '< 10e-06';
    } else if (value < 0.0001) {
      return '< 10e-05';
    } else if (value < 0.001) {
      return '< 10e-04';
    } else {
      return super.transform(value, args);
    }
  }
}
