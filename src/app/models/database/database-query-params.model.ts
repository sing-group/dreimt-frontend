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
import {SignatureType} from '../signature-type.enum';
import {InteractionType} from '../interaction-type.enum';

export class DatabaseQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: DrugSignatureInteractionField;
  public readonly sortDirection?: SortDirection;
  public readonly signatureName?: string;
  public readonly cellTypeA?: string;
  public readonly cellTypeB?: string;
  public readonly cellSubTypeA?: string;
  public readonly cellSubTypeB?: string;
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
  public readonly freeText?: string;
}

