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
import {CmapUpDownSignatureDrugInteractionResultsQueryParams} from '../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction-results-query-params';
import {CmapUpDownSignatureDrugInteractionResults} from '../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction-results';
import saveAs from 'file-saver';
import {CmapUpDownSignatureDrugInteraction} from '../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';
import {GeneSet} from '../../../models/interactions/gene-set.model';
import {UpDownGenes} from '../../../models/interactions/up-down-gene-set.model';

@Injectable({
  providedIn: 'root'
})
export class CmapResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public list(resultId: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): Observable<CmapUpDownSignatureDrugInteractionResults> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<CmapUpDownSignatureDrugInteraction[]>(
      `${environment.dreimtUrl}/results/cmap/signature/` + resultId + `/interactions`, options
    ).pipe(
      DreimtError.throwOnError('Cmap results error', 'Cmap analysis results could not be retrieved.'),
      map((response: HttpResponse<CmapUpDownSignatureDrugInteraction[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }


  public downloadCsv(resultId: string, queryTitle: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams) {
    this.http.get(`${environment.dreimtUrl}/results/cmap/signature/` + resultId + `/interactions`, {
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
        var fileName = '';
        if (!queryTitle) {
          fileName = 'Cmap_' + resultId + '.csv';
        } else {
          fileName = queryTitle.replace(/\s/g, '_') + '.csv';
        }

        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, fileName);
      });
  }


  public listDrugCommonNameValues(resultId: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', resultId, queryParams);
  }

  public listDrugSourceNameValues(resultId: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-name', resultId, queryParams);
  }

  public listDrugSourceDbValues(resultId: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-source-db', resultId, queryParams);
  }

  private listValues(resource: string, resultId: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listMappedValues<string[]>(resource, queryParams, resultId, map(values => values));
  }

  private listMappedValues<A>(
    resource: string, queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams, resultId: string,
    mapper: OperatorFunction<A, string[]>
  ): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams, CmapUpDownSignatureDrugInteractionResultsQueryParams.MANIPULATION_FIELDS)
      })
    };

    return this.http.get<A>(`${environment.dreimtUrl}/results/cmap/signature/params/${resultId}/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }

  public listGenes(resultId: string, onlyUniverseGenes: boolean): Observable<UpDownGenes> {
    const options = {
      params: new HttpParams().set('onlyUniverseGenes', String(onlyUniverseGenes)),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<UpDownGenes>(
      `${environment.dreimtUrl}/results/cmap/signature/` + resultId + `/genes`, options
    ).pipe(
      DreimtError.throwOnError('Drug prioritization query results error', 'Drug prioritization query genes could not be retrieved.'),
      map((response: HttpResponse<UpDownGenes>) => (response.body))
    );
  }
}
