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

import {PartialDataSource} from '../../../../utils/partial-data-source';
import {CmapDrugInteraction} from '../../../../models/interactions/cmap/cmap-drug-interaction.model';
import {CmapDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap/cmap-drug-interaction-results-query-params';
import {CmapResultsService} from '../../services/cmap-results.service';

export class CmapResultsDataSource extends PartialDataSource<CmapDrugInteraction> {
  public constructor(
    private service: CmapResultsService
  ) {
    super();
  }

  public list(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.update(this.service.list(resultId, queryParams));
  }
}
