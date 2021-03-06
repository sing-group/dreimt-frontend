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
import {ExecutionStatus} from '../../../models/work/execution-status.enum';

@Pipe({
  name: 'executionStatusIcon'
})
export class ExecutionStatusIconPipe implements PipeTransform {

  transform(value: string | ExecutionStatus): string {
    switch (value) {
      case ExecutionStatus.CREATE:
        return 'add_circle_outline';
      case ExecutionStatus.SCHEDULED:
        return 'schedule';
      case ExecutionStatus.RUNNING:
        return 'play_circle_outline';
      case ExecutionStatus.COMPLETED:
        return 'check_circle_outline';
      case ExecutionStatus.FAILED:
        return 'error_outline';
      case ExecutionStatus.DELETED:
        return 'warning';
      default:
        return '';
    }
  }
}
