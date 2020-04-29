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

import {CmapGeneSetSignatureDrugInteraction} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';
import {CmapGeneSetSignatureDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results-query-params';
import {PaginatedDataSource} from '../../../../models/data-source/paginated-data-source';
import {Pagination} from '../../../../models/data-source/pagination';

export class CmapGeneSetSignatureResultsDataSource extends PaginatedDataSource<CmapGeneSetSignatureDrugInteraction> {
  private queryParams?: CmapGeneSetSignatureDrugInteractionResultsQueryParams;

  public constructor(
    private service: CmapGeneSetResultsService
  ) {
    super();
  }

  public list(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    if (this.haveFiltersChanged(queryParams)) {
      const pagination = new Pagination(queryParams.page, queryParams.pageSize);

      const unpaginatedQueryParams = {...queryParams};
      unpaginatedQueryParams.page = undefined;
      unpaginatedQueryParams.pageSize = undefined;

      this.queryParams = queryParams;
      this.update(this.service.listAll(resultId, unpaginatedQueryParams), pagination);
    } else if (this.hasPaginationChanged(queryParams)) {
      const pagination = new Pagination(queryParams.page, queryParams.pageSize);

      this.queryParams = queryParams;
      this.updatePage(pagination);
    }
  }

  private hasPaginationChanged(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): boolean {
    if (this.queryParams === undefined) {
      return queryParams !== undefined;
    } else {
      return this.queryParams.page !== queryParams.page
        || this.queryParams.pageSize !== queryParams.pageSize;
    }
  }

  private haveFiltersChanged(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): boolean {
    if (this.queryParams === undefined) {
      return queryParams !== undefined;
    } else {
      return this.queryParams.orderField !== queryParams.orderField
        || this.queryParams.sortDirection !== queryParams.sortDirection
        || this.queryParams.minTau !== queryParams.minTau
        || this.queryParams.maxFdr !== queryParams.maxFdr
        || this.queryParams.drugMoa !== queryParams.drugMoa
        || this.queryParams.minDrugDss !== queryParams.minDrugDss
        || this.queryParams.drugCommonName !== queryParams.drugCommonName;
    }
  }
}
