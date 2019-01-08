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
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {
  JaccardCalculateInteractionsQueryParams
} from '../../../models/interactions/jaccard/jaccard-calculate-interactions-query-params.model';
import {toPlainObject} from '../../../utils/types';

@Injectable({
  providedIn: 'root'
})
export class SignaturesService {

  public constructor(
    private http: HttpClient
  ) {
  }

  public listCellTypeAValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('cell-type-a', queryParams);
  }

  public listCellSubTypeAValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-a', queryParams);
  }
  public listCellTypeBValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('cell-type-b', queryParams);
  }


  public listCellSubTypeBValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-b', queryParams);
  }

  public listDiseaseValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('disease', queryParams);
  }

  public listOrganismValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('organism', queryParams);
  }

  public listSignatureSourceDbValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('signature-source-db', queryParams);
  }

  public listExperimentalDesignValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('experimental-design', queryParams);
  }

  public listSignatureTypeValues(queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    return this.listValues('signature-type', queryParams);
  }

  private listValues(resource: string, queryParams: JaccardCalculateInteractionsQueryParams): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      })
    };

    return this.http.get<string[]>(`${environment.dreimtUrl}/signature/params/${resource}/values`, options)
      .pipe(
        DreimtError.throwOnError(
          'Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.'
        )
      );
  }
}
