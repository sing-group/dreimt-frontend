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

import {GeneOverlapField} from '../jaccard/gene-overlap-field.enum';
import {SortDirection} from '../../sort-direction.enum';

export class CmapDrugInteractionResultsQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection', 'resultId'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: GeneOverlapField;
  public readonly sortDirection?: SortDirection;
  public readonly maxPvalue?: number;
  public readonly minTes?: number;
  public readonly maxTes?: number;
  public readonly maxFdr?: number;
  public readonly drugSourceName?: string;
  public readonly drugSourceDb?: string;
  public readonly drugCommonName?: string;
}
