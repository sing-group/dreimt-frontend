import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'organismIcon'
})
export class OrganismPipe implements PipeTransform {

  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'homo sapiens':
        return 'homo-sapiens';
      case 'mus musculus':
        return 'mus-musculus';
      default:
        return '';
    }
  }
}
