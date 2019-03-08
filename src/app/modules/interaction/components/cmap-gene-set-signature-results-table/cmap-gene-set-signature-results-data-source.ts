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

import {PartialDataSource} from '../../../../utils/partial-data-source';
import {CmapGeneSetSignatureDrugInteraction} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';
import {CmapGeneSetSignatureDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results-query-params';

export class CmapGeneSetSignatureResultsDataSource extends PartialDataSource<CmapGeneSetSignatureDrugInteraction> {
  public constructor(
    private service: CmapGeneSetResultsService
  ) {
    super();
  }

  public list(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    this.update(this.service.list(resultId, queryParams));
  }
}
