/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2019 - Hugo López-Fernández,
 *  Daniel González-Peña, Miguel Reboiro-Jato, Kevin Troulé,
 *  Fátima Al-Sharhour and Gonzalo Gómez-López.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {Pipe, PipeTransform} from '@angular/core';
import {InteractionType} from '../../../models/interaction-type.enum';

@Pipe({
  name: 'interactionTypeIcon'
})
export class InteractionTypeIconPipe implements PipeTransform {

  transform(value: string | InteractionType): string {
    switch (value) {
      case 'GENESET':
      case InteractionType.GENESET:
        return 'grain';
      case InteractionType.SIGNATURE:
        return 'swap_vert';
      case InteractionType.SIGNATURE_UP:
        return 'arrow_upward';
      case InteractionType.SIGNATURE_DOWN:
        return 'arrow_downward';
      default:
        return '';
    }
  }

}
