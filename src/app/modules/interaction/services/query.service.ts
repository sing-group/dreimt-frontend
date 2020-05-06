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
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CalculatedInterationQueryResult} from '../../../models/interactions/calculated-interation-query-result.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {CalculateInteractionsQueryParamsModel} from '../../../models/interactions/calculate-interactions-query.params.model';
import {Work} from '../../../models/work/work.model';
import {JaccardQueryResultMetadata} from '../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
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

  public launchCmapQuery(queryParams: CalculateInteractionsQueryParamsModel): Observable<Work> {
    return this.launchQuery(queryParams, 'cmap');
  }

  public launchJaccardQuery(queryParams: CalculateInteractionsQueryParamsModel): Observable<Work> {
    return this.launchQuery(queryParams, 'jaccard');
  }

  private launchQuery(queryParams: CalculateInteractionsQueryParamsModel, analysisResource: string): Observable<Work> {
    let body: {
      upGenes?: string[];
      downGenes?: string[];
    };

    if (queryParams.genes.up.length === 0) {
      body = {downGenes: queryParams.genes.down};
    } else if (queryParams.genes.up.length === 0) {
      body = {upGenes: queryParams.genes.up};
    } else {
      body = {upGenes: queryParams.genes.up, downGenes: queryParams.genes.down};
    }

    Object.assign(body, body, queryParams.params);

    return this.http.post<Work>(
      `${environment.dreimtUrl}/interactions/query/${analysisResource}`, body
    ).pipe(
      tap(work => this.workService.addUserWork(work.id.id)),
      DreimtError.throwOnError('Query error',
        (error: HttpErrorResponse) => 'Query could not be launched due to the following error: ' + error.error)
    );
  }

  public getWorkResult(work: Work): Observable<JaccardQueryResultMetadata | CmapQueryUpDownSignatureResultsMetadata> {
    return this.http.get<JaccardQueryResultMetadata | CmapQueryUpDownSignatureResultsMetadata>(
      work.resultReference
    )
      .pipe(
        tap(result => result.id = work.id.id),
        DreimtError.throwOnError(
          'Error retrieving results', 'Results could not be retrieved from the backend.'
        )
      );
  }
}
