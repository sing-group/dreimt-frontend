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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalculatedInterationQueryResult} from '../../../models/interactions/calculated-interation-query-result.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {CalculateInteractionsQueryParamsModel} from '../../../models/interactions/calculate-interactions-query.params.model';
import {Work} from '../../../models/work/work.model';
import {CmapCalculateInteractionsQueryParams} from '../../../models/interactions/cmap/cmap-calculate-interactions-query-params.model';
import {UpDownGenes} from '../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../models/interactions/gene-set.model';
import {JaccardQueryResultMetadata} from '../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {CmapQueryResultsMetadata} from '../../../models/interactions/cmap/cmap-query-results-metadata';
import {tap} from 'rxjs/operators';
import {WorkService} from '../../work/services/work.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  public constructor(
    private http: HttpClient,
    private workService: WorkService
  ) {
  }

  public list(): Observable<CalculatedInterationQueryResult[]> {
    return this.http.get<CalculatedInterationQueryResult[]>(
      `${environment.dreimtUrl}/interaction`
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell results could not be retrieved.')
    );
  }

  public launchQuery(queryParams: CalculateInteractionsQueryParamsModel): Observable<Work> {
    let body: {
      upGenes: string[];
      downGenes?: string[];
    };

    if (UpDownGenes.isA(queryParams.genes)) {
      body = {upGenes: queryParams.genes.upGenes, downGenes: queryParams.genes.downGenes};
    } else if (GeneSet.isA(queryParams.genes)) {
      body = {upGenes: queryParams.genes.genes};
    }

    let analysisResource: string;
    if (CmapCalculateInteractionsQueryParams.isA(queryParams.params)) {
      analysisResource = 'cmap';
    } else {
      analysisResource = 'jaccard';
    }

    Object.assign(body, body, queryParams.params);

    return this.http.post<Work>(
      `${environment.dreimtUrl}/interactions/query/${analysisResource}`, body
    ).pipe(
      tap(work => this.workService.addUserWork(work.id.id)),
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell results could not be retrieved.')
    );
  }

  public getWorkResult(work: Work): Observable<JaccardQueryResultMetadata | CmapQueryResultsMetadata> {
    return this.http.get<JaccardQueryResultMetadata | CmapQueryResultsMetadata>(
      work.resultReference
    )
      .pipe(
        DreimtError.throwOnError(
          'Error retrieving results', 'Results could not be retrieved from the backend.'
        )
      );
  }
}
