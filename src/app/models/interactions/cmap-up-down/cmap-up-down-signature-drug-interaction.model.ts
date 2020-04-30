/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2019 - Hugo López-Fernández,
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

import {Drug} from '../../drug.model';

export class CmapUpDownSignatureDrugInteraction {
  public readonly drug: Drug;
  public readonly tau: number;
  public readonly upFdr: number;
  public readonly downFdr: number;
  public readonly drugEffect: string;

  public static isA(object: any): object is CmapUpDownSignatureDrugInteraction {
    return object !== undefined && object !== null
      && Drug.isA(object.drug)
      && typeof object.tau === 'number'
      && typeof object.upFdr === 'number'
      && typeof object.downFdr === 'number'
      && typeof object.drugEffect === 'string';
  }
}
