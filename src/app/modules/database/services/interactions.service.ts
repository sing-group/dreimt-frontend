/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018 - Hugo López-Fernández,
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
import {Observable} from 'rxjs';
import {DrugSignatureInteractionQueryParams} from '../models/drug-signature-interaction-query-params.model';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {DrugSignatureInteraction} from '../models/drug-signature-interaction.model';
import {DrugSignatureInteractionQueryResult} from '../models/drug-signature-interaction-query-result.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public list(queryParams: DrugSignatureInteractionQueryParams): Observable<DrugSignatureInteractionQueryResult> {
    const options = {
      params: new HttpParams({
        fromObject: DrugSignatureInteractionQueryParams.toPlainObject(queryParams)
      }),
      observe: 'response' as 'response'
    };

    return this.http.get<DrugSignatureInteraction[]>(
      `${environment.dreimtUrl}/interactions`, options
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell interactions could not be retrieved.'),
      map((response: HttpResponse<DrugSignatureInteraction[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }
}
