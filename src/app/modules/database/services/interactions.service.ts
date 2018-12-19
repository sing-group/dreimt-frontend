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
import {Observable, OperatorFunction} from 'rxjs';
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

  public listDrugCommonNameValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', queryParams);
  }

  public listSignatureNameValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('signature-name', queryParams);
  }

  public listCellTypeAValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('cell-type-a', queryParams);
  }

  public listCellTypeBValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('cell-type-b', queryParams);
  }

  public listCellSubTypeAValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-a', queryParams);
  }

  public listCellSubTypeBValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-b', queryParams);
  }

  public listDiseaseValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('disease', queryParams);
  }
  public listOrganismValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('organism', queryParams);
  }

  public listSignatureSourceDbValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('signature-source-db', queryParams);
  }

  public listSignaturePubMedIdValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listMappedValues<number[]>('signature-pubmed-id', queryParams,
      map(pubmedIds => pubmedIds.map(pubmedId => String(pubmedId)))
    );
  }

  public listDrugSourceNameValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('drug-source-name', queryParams);
  }

  public listDrugSourceDbValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('drug-source-db', queryParams);
  }

  public listExperimentalDesignValues(queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    return this.listValues('experimental-design', queryParams);
  }

  private listValues(resource: string, queryParams: DrugSignatureInteractionQueryParams): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: DrugSignatureInteractionQueryParams.toPlainObjectOnlyFilterFields(queryParams)
      })
    };

    return this.http.get<string[]>(`${environment.dreimtUrl}/interactions/params/${resource}/values`, options)
      .pipe(DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.'));
  }

  private listMappedValues<A>(
    resource: string, queryParams: DrugSignatureInteractionQueryParams,
    mapper: OperatorFunction<A, string[]>
  ): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: DrugSignatureInteractionQueryParams.toPlainObjectOnlyFilterFields(queryParams)
      })
    };

    return this.http.get<A>(`${environment.dreimtUrl}/interactions/params/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }
}
