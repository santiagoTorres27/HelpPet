import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeKind',
})
export class PipeKindPipe implements PipeTransform {
  transform(value: string): unknown {
    let kind: string = '';
    switch (value) {
      case 'dog':
        kind = 'Perro';
        break;

      case 'cat':
        kind = 'Gato';
        break;

      case 'bird':
        kind = 'Ave';
        break;

      case 'other':
        kind = 'Otro';
        break;
    }

    return kind;
  }
}
