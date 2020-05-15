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


import {ExperimentalDesign} from '../../experimental-design.enum';
import {isNullOrUndefined} from 'util';

export class JaccardCalculateInteractionsQueryParams {
  public readonly queryTitle?: string;
  public readonly cellType1?: string;
  public readonly cellSubType1?: string;
  public readonly cellTypeOrSubType1?: string;
  public readonly cellType2?: string;
  public readonly cellSubType2?: string;
  public readonly cellTypeOrSubType2?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly disease?: string;
  public readonly organism?: string;
  public readonly signatureSourceDb?: string;
  public readonly onlyUniverseGenes?: boolean;

  public static equals(a: JaccardCalculateInteractionsQueryParams, b: JaccardCalculateInteractionsQueryParams): boolean {
    if (isNullOrUndefined(a) || isNullOrUndefined(b)) {
      return false;
    } else if (isNullOrUndefined(a)) {
      return true;
    } else {
      return a.queryTitle === b.queryTitle &&
        a.cellType1 === b.cellType1 &&
        a.cellType2 === b.cellType2 &&
        a.cellSubType1 === b.cellSubType1 &&
        a.cellSubType2 === b.cellSubType2 &&
        a.cellTypeOrSubType1 === b.cellTypeOrSubType1 &&
        a.cellTypeOrSubType2 === b.cellTypeOrSubType2 &&
        a.experimentalDesign === b.experimentalDesign &&
        a.disease === b.disease &&
        a.organism === b.organism &&
        a.signatureSourceDb === b.signatureSourceDb &&
        a.onlyUniverseGenes === b.onlyUniverseGenes;
    }
  }
}
