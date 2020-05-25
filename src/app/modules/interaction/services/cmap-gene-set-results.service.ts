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
import {CmapGeneSetSignatureDrugInteraction} from '../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {GeneSet} from '../../../models/interactions/gene-set.model';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';

@Injectable({
  providedIn: 'root'
})
export class CmapGeneSetResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getMetadata(resultId: string): Observable<CmapQueryGeneSetSignatureResultsMetadata> {
    return this.http.get<CmapQueryGeneSetSignatureResultsMetadata>(`${environment.dreimtUrl}/results/drug-prioritization/geneset/` + resultId)
      .pipe(
        DreimtError.throwOnError('Drug prioritization results error', 'Drug prioritization results could not be retrieved.')
      );
  }

  public listAll(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams)
    : Observable<CmapGeneSetSignatureDrugInteraction[]> {
    if (queryParams.page !== undefined || queryParams.pageSize !== undefined) {
      throw new TypeError('page and pageSize values not supported in queryParams');
    }

    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<CmapGeneSetSignatureDrugInteraction[]>(
      `${environment.dreimtUrl}/results/drug-prioritization/geneset/` + resultId + `/associations`, options
    ).pipe(
      DreimtError.throwOnError('Drug prioritization results error', 'Drug prioritization results could not be retrieved.')
    );
  }

  public downloadCsv(resultId: string, queryTitle: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams) {
    this.http.get(`${environment.dreimtUrl}/results/drug-prioritization/geneset/` + resultId + `/associations`, {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      headers: new HttpHeaders({
        'Accept': 'text/csv'
      }), responseType: 'blob'
    })
      .pipe(
        DreimtError.throwOnError(
          'Error requesting Drug prioritization results',
          `CSV for Drug prioritization results with '${resultId}' could not be retrieved from the backend.`
        )
      )
      .subscribe(res => {
        var fileName = '';
        if (!queryTitle) {
          fileName = 'drug-prioritization_' + resultId + '.csv';
        } else {
          fileName = queryTitle.replace(/\s/g, '_') + '.csv';
        }

        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, fileName);
      });
  }

  public listDrugCommonNameValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', resultId, queryParams);
  }

  public listDrugMoaValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-moa', resultId, queryParams);
  }

  public listDrugStatusValues(resultId: string, queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): Observable<string[]> {
    return this.listValues('drug-status', resultId, queryParams);
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

    return this.http.get<A>(`${environment.dreimtUrl}/results/drug-prioritization/geneset/params/${resultId}/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }

  public listGenes(resultId: string, onlyUniverseGenes: boolean): Observable<GeneSet> {
    const options = {
      params: new HttpParams().set('onlyUniverseGenes', String(onlyUniverseGenes)),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<GeneSet>(
      `${environment.dreimtUrl}/results/drug-prioritization/geneset/` + resultId + `/genes`, options
    ).pipe(
      DreimtError.throwOnError('Drug prioritization query results error', 'Drug prioritization query genes could not be retrieved.'),
      map((response: HttpResponse<GeneSet>) => (response.body))
    );
  }
}
