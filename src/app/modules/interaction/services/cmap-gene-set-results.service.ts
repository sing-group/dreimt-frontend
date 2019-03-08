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
import saveAs from 'file-saver';
import {CmapGeneSetSignatureDrugInteractionResultsQueryParams} from '../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results-query-params';
import {CmapGeneSetSignatureDrugInteractionResults} from '../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results';
import {CmapGeneSetSignatureDrugInteraction} from '../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';

@Injectable({
  providedIn: 'root'
})
export class CmapGeneSetResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public list(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<CmapGeneSetSignatureDrugInteractionResults> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<CmapGeneSetSignatureDrugInteraction[]>(
      `${environment.dreimtUrl}/results/cmap/geneset/` + resultId + `/interactions`, options
    ).pipe(
      DreimtError.throwOnError('Cmap results error', 'Cmap analysis results could not be retrieved.'),
      map((response: HttpResponse<CmapGeneSetSignatureDrugInteraction[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }


  public downloadCsv(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams) {
    this.http.get(`${environment.dreimtUrl}/results/cmap/geneset/` + resultId + `/interactions`, {
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


  public listDrugCommonNameValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', resultId, queryParams);
  }

  public listDrugSourceNameValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-name', resultId, queryParams);
  }

  public listDrugSourceDbValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-db', resultId, queryParams);
  }

  private listValues(resource: string, resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listMappedValues<string[]>(resource, queryParams, resultId, map(values => values));
  }

  private listMappedValues<A>(
    resource: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams, resultId: string,
    mapper: OperatorFunction<A, string[]>
  ): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams, CmapGeneSetSignatureDrugInteractionResultsQueryParams.MANIPULATION_FIELDS)
      })
    };

    return this.http.get<A>(`${environment.dreimtUrl}/results/cmap/geneset/params/${resultId}/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }
}