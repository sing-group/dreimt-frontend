/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018 - Hugo López-Fernández,
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

import {JaccardComparisonType} from './jaccard-comparison-type.enum';
import {SignatureSummary} from './signature-summary.model';

export class GeneOverlap {
  public readonly sourceComparisonType: JaccardComparisonType;
  public readonly targetSignatureData: SignatureSummary;
  public readonly targetComparisonType: JaccardComparisonType;
  public readonly jaccard: number;
  public readonly pvalue: number;
  public readonly fdr: number;

  public static isA(object: any): object is GeneOverlap {
    return object !== undefined && object !== null
      && SignatureSummary.isA(object.targetSignatureData)
      // TODO: check comparison type
      && typeof object.jaccard === 'number'
      && typeof object.pvalue === 'number'
      && typeof object.fdr === 'number';
  }
}
