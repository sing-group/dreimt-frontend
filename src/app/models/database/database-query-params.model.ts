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

import {SortDirection} from '../sort-direction.enum';
import {DrugSignatureInteractionField} from '../drug-signature-interaction-field.enum';
import {ExperimentalDesign} from '../experimental-design.enum';
import {InteractionType} from '../interaction-type.enum';
import {isNullOrUndefined} from 'util';

export class DatabaseQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: DrugSignatureInteractionField;
  public readonly sortDirection?: SortDirection;
  public readonly signatureName?: string;
  public readonly cellType1?: string;
  public readonly cellType2?: string;
  public readonly cellSubType1?: string;
  public readonly cellSubType2?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly disease?: string;
  public readonly organism?: string;
  public readonly signaturePubMedId?: string;
  public readonly drugSourceName?: string;
  public readonly drugSourceDb?: string;
  public readonly drugCommonName?: string;
  public readonly signatureSourceDb?: string;
  public readonly interactionType?: InteractionType;
  public readonly minTau?: number;
  public readonly maxUpFdr?: number;
  public readonly maxDownFdr?: number;

  public static equals(a: DatabaseQueryParams, b: DatabaseQueryParams): boolean {
    if (isNullOrUndefined(a) || isNullOrUndefined(b)) {
      return false;
    } else if (isNullOrUndefined(a)) {
      return true;
    } else {
      return a.page === b.page &&
        a.pageSize === b.pageSize &&
        a.orderField === b.orderField &&
        a.sortDirection === b.sortDirection &&
        a.signatureName === b.signatureName &&
        a.cellType1 === b.cellType1 &&
        a.cellType2 === b.cellType2 &&
        a.cellSubType1 === b.cellSubType1 &&
        a.cellSubType2 === b.cellSubType2 &&
        a.experimentalDesign === b.experimentalDesign &&
        a.disease === b.disease &&
        a.organism === b.organism &&
        a.signaturePubMedId === b.signaturePubMedId &&
        a.drugSourceName === b.drugSourceName &&
        a.drugSourceDb === b.drugSourceDb &&
        a.drugCommonName === b.drugCommonName &&
        a.signatureSourceDb === b.signatureSourceDb &&
        a.interactionType === b.interactionType &&
        a.minTau === b.minTau &&
        a.maxUpFdr === b.maxUpFdr;
    }
  }
}

