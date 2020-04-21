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

import {GeneOverlapField} from '../jaccard/gene-overlap-field.enum';
import {SortDirection} from '../../sort-direction.enum';
import {CmapGeneSetSignatureResultField} from './cmap-gene-set-signature-result-field.enum';

export class CmapGeneSetSignatureDrugInteractionResultsQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection', 'resultId'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: CmapGeneSetSignatureResultField;
  public readonly sortDirection?: SortDirection;
  public readonly minTau?: number;
  public readonly maxFdr?: number;
  public readonly drugCommonName?: string;
  public readonly drugMoa?: string;
}
