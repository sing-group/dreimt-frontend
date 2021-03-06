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
import {JaccardComparisonType} from '../../../models/interactions/jaccard/jaccard-comparison-type.enum';
import {CellTypeAndSubtypeDistributions} from '../../../models/cell-type-and-subtype-distributions.model';

@Injectable({
  providedIn: 'root'
})
export class JaccardResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getMetadata(resultId: string): Observable<JaccardQueryResultMetadata> {
    return this.http.get<JaccardQueryResultMetadata>(`${environment.dreimtUrl}/results/signatures-comparison/` + resultId)
      .pipe(
        DreimtError.throwOnError('Signature comparison information error', 'Signature comparison information could not be retrieved.')
      );
  }

  public list(resultId: string, queryParams: JaccardOverlapsQueryParams): Observable<GeneOverlap[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<GeneOverlap[]>(
      `${environment.dreimtUrl}/results/signatures-comparison/` + resultId + `/overlaps`, options
    ).pipe(
      DreimtError.throwOnError('Signature comparison results error', 'Signature comparison results could not be retrieved.')
    );
  }

  public downloadCsv(resultId: string, queryTitle: string, queryParams: JaccardOverlapsQueryParams): void {
    this.http.get(`${environment.dreimtUrl}/results/signatures-comparison/` + resultId + `/overlaps`, {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
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
        let fileName = '';
        if (!queryTitle) {
          fileName = 'signatures-comparison_' + resultId + '.csv';
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
      `${environment.dreimtUrl}/results/signatures-comparison/` + resultId + `/genes`, options
    ).pipe(
      DreimtError.throwOnError('Signature comparison results error', 'Jaccard query genes could not be retrieved.'),
      map((response: HttpResponse<UpDownGenes>) => (response.body.down ? response.body : {genes: response.body.up}))
    );
  }

  public downloadInteractionGenes(
    queryTitle: string, resultId: string, signatureName: string,
    sourceComparisonType: JaccardComparisonType, targetComparisonType: JaccardComparisonType
  ): void {
    this.http.get(`${environment.dreimtUrl}/results/signatures-comparison/` + resultId + `/genes/intersection/` + signatureName, {
      params: new HttpParams({
        fromObject: toPlainObject({
          sourceComparisonType: sourceComparisonType,
          targetComparisonType: targetComparisonType
        })
      }),
      headers: new HttpHeaders({
        'Accept': 'text/plain'
      }), responseType: 'blob'
    })
      .pipe(
        DreimtError.throwOnError(
          'Error requesting Jaccard result genes',
          `Interesection genes for Jaccard result '${resultId}' could not be retrieved from the backend.`
        )
      )
      .subscribe(res => {
        let fileName = '';
        const interactionTitle = `${sourceComparisonType}_VS_${signatureName}_${targetComparisonType}`;
        if (!queryTitle) {
          fileName = `Jaccard_${resultId}_${interactionTitle}.txt`;
        } else {
          const queryTitleFixed = queryTitle.replace(/\s/g, '_');
          fileName = `${queryTitleFixed}_${interactionTitle}.txt`;
        }

        const blob = new Blob([res], {type: 'text/plain'});
        saveAs(blob, fileName);
      });
  }

  public cellTypeAndSubTypeDistribution(resultId: string): Observable<CellTypeAndSubtypeDistributions> {
    const options = {
      params: new HttpParams().set('id', resultId),
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<CellTypeAndSubtypeDistributions>(
      `${environment.dreimtUrl}/results/signatures-comparison/` + resultId + `/distribution/cell-type-and-subtype`, options
    ).pipe(
      DreimtError.throwOnError('Signature comparison results error', 'Jaccard query genes could not be retrieved.')
    );
  }
}
