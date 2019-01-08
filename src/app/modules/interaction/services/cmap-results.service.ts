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
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, OperatorFunction} from 'rxjs';
import {toPlainObject} from '../../../utils/types';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {map} from 'rxjs/operators';
import {CmapDrugInteractionResultsQueryParams} from '../../../models/interactions/cmap/cmap-drug-interaction-results-query-params';
import {CmapDrugInteractionResults} from '../../../models/interactions/cmap/cmap-drug-interaction-results';
import saveAs from 'file-saver';
import {CmapDrugInteraction} from '../../../models/interactions/cmap/cmap-drug-interaction.model';

@Injectable({
  providedIn: 'root'
})
export class CmapResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public list(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): Observable<CmapDrugInteractionResults> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<CmapDrugInteraction[]>(
      `${environment.dreimtUrl}/results/cmap/` + resultId + `/interactions`, options
    ).pipe(
      DreimtError.throwOnError('Cmap results error', 'Cmap analysis results could not be retrieved.'),
      map((response: HttpResponse<CmapDrugInteraction[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }


  public downloadCsv(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams) {
    this.http.get(`${environment.dreimtUrl}/results/cmap/` + resultId + `/interactions`, {
      headers: new HttpHeaders({
        'Accept': 'text/csv'
      }), responseType: 'blob'
    })
      .pipe(
        DreimtError.throwOnError(
          'Error requesting Cmap result',
          `CSV for Cmap result '${resultId}' could not be retrieved from the backend.`
        )
      )
      .subscribe(res => {
        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, 'Cmap_' + resultId + '.csv');
      });
  }


  public listDrugCommonNameValues(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', resultId, queryParams);
  }

  public listDrugSourceNameValues(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-name', resultId, queryParams);
  }

  public listDrugSourceDbValues(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-db', resultId, queryParams);
  }

  private listValues(resource: string, resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listMappedValues<string[]>(resource, queryParams, resultId, map(values => values));
  }

  private listMappedValues<A>(
    resource: string, queryParams: CmapDrugInteractionResultsQueryParams, resultId: string,
    mapper: OperatorFunction<A, string[]>
  ): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams, CmapDrugInteractionResultsQueryParams.MANIPULATION_FIELDS)
      })
    };

    return this.http.get<A>(`${environment.dreimtUrl}/results/cmap/params/${resultId}/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }
}
