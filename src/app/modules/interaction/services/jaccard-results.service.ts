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
import {Observable} from 'rxjs';
import {toPlainObject} from '../../../utils/types';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {map} from 'rxjs/operators';
import {JaccardOverlapsQueryParams} from '../../../models/interactions/jaccard/jaccard-overlaps-query-params';
import {GeneOverlapResults} from '../../../models/interactions/jaccard/gene-overlap-results.model';
import saveAs from 'file-saver';
import {GeneOverlap} from '../../../models/interactions/jaccard/gene-overlap.model';
import {GeneSet} from '../../../models/interactions/gene-set.model';
import {UpDownGenes} from '../../../models/interactions/up-down-gene-set.model';
import {JaccardQueryResultMetadata} from '../../../models/interactions/jaccard/jaccard-query-result-metadata';

@Injectable({
  providedIn: 'root'
})
export class JaccardResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getMetadata(resultId: string): Observable<JaccardQueryResultMetadata> {
    return this.http.get<JaccardQueryResultMetadata>(`${environment.dreimtUrl}/results/jaccard/` + resultId)
      .pipe(
        DreimtError.throwOnError('Signature comparison information error', 'Signature comparison information could not be retrieved.')
      );
  }

  public list(resultId: string, queryParams: JaccardOverlapsQueryParams): Observable<GeneOverlapResults> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<GeneOverlap[]>(
      `${environment.dreimtUrl}/results/jaccard/` + resultId + `/overlaps`, options
    ).pipe(
      DreimtError.throwOnError('Signature comparison results error', 'Signature comparison results could not be retrieved.'),
      map((response: HttpResponse<GeneOverlap[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }

  public downloadCsv(resultId: string, queryTitle: string, queryParams: JaccardOverlapsQueryParams) {
    this.http.get(`${environment.dreimtUrl}/results/jaccard/` + resultId + `/overlaps`, {
      headers: new HttpHeaders({
        'Accept': 'text/csv'
      }), responseType: 'blob'
    })
      .pipe(
        DreimtError.throwOnError(
          'Error requesting Jaccard result',
          `CSV for Jaccard result '${resultId}' could not be retrieved from the backend.`
        )
      )
      .subscribe(res => {
        var fileName = '';
        if (!queryTitle) {
          fileName = 'Jaccard_' + resultId + '.csv';
        } else {
          fileName = queryTitle.replace(/\s/g, '_') + '.csv';
        }

        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, fileName);
      });
  }

  public listGenes(resultId: string, onlyUniverseGenes: boolean): Observable<UpDownGenes | GeneSet> {
    const options = {
      params: new HttpParams().set('onlyUniverseGenes', String(onlyUniverseGenes)),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<UpDownGenes>(
      `${environment.dreimtUrl}/results/jaccard/` + resultId + `/genes`, options
    ).pipe(
      DreimtError.throwOnError('Signature comparison results error', 'Jaccard query genes could not be retrieved.'),
      map((response: HttpResponse<UpDownGenes>) => (response.body.down ? response.body : {genes: response.body.up}))
    );
  }
}
