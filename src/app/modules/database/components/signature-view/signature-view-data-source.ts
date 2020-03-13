/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2020 - Hugo López-Fernández,
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

import {PaginatedDataSource} from '../../../../models/data-source/paginated-data-source';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {InteractionsService} from '../../services/interactions.service';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {Pagination} from '../../../../models/data-source/pagination';
import {of} from 'rxjs';

export class SignatureViewDataSource extends PaginatedDataSource<DrugCellDatabaseInteraction> {
  private queryParams?: DatabaseQueryParams;

  public constructor(
    private service: InteractionsService
  ) {
    super();
  }

  public list(queryParams: DatabaseQueryParams): void {
    if (this.haveFiltersChanged(queryParams)) {
      const pagination = new Pagination(queryParams.page, queryParams.pageSize);

      const unpaginatedQueryParams = {...queryParams};
      unpaginatedQueryParams.page = undefined;
      unpaginatedQueryParams.pageSize = undefined;

      this.queryParams = queryParams;
      this.service.list(unpaginatedQueryParams)
        .subscribe(result => this.update(of(result.result), pagination));
    } else if (this.hasPaginationChanged(queryParams)) {
      const pagination = new Pagination(queryParams.page, queryParams.pageSize);

      this.queryParams = queryParams;
      this.updatePage(pagination);
    }
  }

  private hasPaginationChanged(queryParams: DatabaseQueryParams): boolean {
    if (this.queryParams === undefined) {
      return queryParams !== undefined;
    } else {
      return this.queryParams.page !== queryParams.page
        || this.queryParams.pageSize !== queryParams.pageSize;
    }
  }

  private haveFiltersChanged(queryParams: DatabaseQueryParams): boolean {
    if (this.queryParams === undefined) {
      return queryParams !== undefined;
    } else {
      return this.queryParams.orderField !== queryParams.orderField
        || this.queryParams.sortDirection !== queryParams.sortDirection
        || this.queryParams.minTau !== queryParams.minTau
        || this.queryParams.maxDownFdr !== queryParams.maxDownFdr
        || this.queryParams.maxUpFdr !== queryParams.maxUpFdr
        || this.queryParams.drugSourceName !== queryParams.drugSourceName
        || this.queryParams.drugSourceDb !== queryParams.drugSourceDb
        || this.queryParams.drugCommonName !== queryParams.drugCommonName;
    }
  }
}
