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
import {Observable, OperatorFunction} from 'rxjs';
import {DatabaseQueryParams} from '../../../models/database/database-query-params.model';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {DrugCellDatabaseInteraction} from '../../../models/database/drug-cell-database-interaction.model';
import {DatabaseQueryResult} from '../../../models/database/database-query-result.model';
import {map} from 'rxjs/operators';
import {toPlainObject} from '../../../utils/types';
import {CellTypeAndSubtype} from '../../../models/cell-type-and-subtype.model';
import {UpDownGenes} from '../../../models/interactions/up-down-gene-set.model';
import saveAs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor(
    private http: HttpClient
  ) {
  }

  public list(queryParams: DatabaseQueryParams): Observable<DatabaseQueryResult> {
    const options = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      }),
      observe: 'response' as 'response'
    };

    return this.http.get<DrugCellDatabaseInteraction[]>(
      `${environment.dreimtUrl}/database/associations`, options
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell results could not be retrieved.'),
      map((response: HttpResponse<DrugCellDatabaseInteraction[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }

  public listArray(queryParams: DatabaseQueryParams): Observable<DrugCellDatabaseInteraction[]> {
    const options = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      })
    };

    return this.http.get<DrugCellDatabaseInteraction[]>(
      `${environment.dreimtUrl}/database/associations`, options
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell results could not be retrieved.')
    );
  }

  public listCellTypeAndSubtype1Values(queryParams: DatabaseQueryParams): Observable<CellTypeAndSubtype[]> {
    return this.listCellTypeAndSubtypeValues('cell-type-and-subtype-1', queryParams);
  }

  public listCellTypeAndSubtype2Values(queryParams: DatabaseQueryParams): Observable<CellTypeAndSubtype[]> {
    return this.listCellTypeAndSubtypeValues('cell-type-and-subtype-2', queryParams);
  }

  private listCellTypeAndSubtypeValues(resource: string, queryParams: DatabaseQueryParams): Observable<CellTypeAndSubtype[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams, DatabaseQueryParams.MANIPULATION_FIELDS)
      })
    };

    return this.http.get<CellTypeAndSubtype[]>(`${environment.dreimtUrl}/database/associations/params/${resource}/values`, options)
      .pipe(
        DreimtError.throwOnError(
          'Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.'
        )
      );
  }

  public listDrugCommonNameValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('drug-common-name', queryParams);
  }

  public listDrugMoaValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('drug-moa', queryParams);
  }

  public listDrugStatusValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('drug-status', queryParams);
  }

  public listSignatureNameValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('signature-name', queryParams);
  }

  public listCellType1Values(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-type-1', queryParams);
  }

  public listCellType2Values(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-type-2', queryParams);
  }

  public listCellSubType1Values(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-1', queryParams);
  }

  public listCellSubType2Values(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-subtype-2', queryParams);
  }

  public loadCellType1DiseaseValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-type-1-disease', queryParams);
  }

  public loadCellType1TreatmentValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('cell-type-1-treatment', queryParams);
  }

  public listDiseaseValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('disease', queryParams);
  }

  public listOrganismValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('organism', queryParams);
  }

  public listSignatureSourceDbValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('signature-source-db', queryParams);
  }

  public listSignaturePubMedIdValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listMappedValues<number[]>('signature-pubmed-id', queryParams,
      map(pubmedIds => pubmedIds.map(pubmedId => String(pubmedId)))
    );
  }

  public listDrugSourceNameValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('drug-source-name', queryParams);
  }

  public listDrugSourceDbValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('drug-source-db', queryParams);
  }

  public listExperimentalDesignValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('experimental-design', queryParams);
  }

  public listInteractionTypeValues(queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listValues('interaction-type', queryParams);
  }

  private listValues(resource: string, queryParams: DatabaseQueryParams): Observable<string[]> {
    return this.listMappedValues<string[]>(resource, queryParams, map(values => values));
  }

  private listMappedValues<A>(
    resource: string, queryParams: DatabaseQueryParams,
    mapper: OperatorFunction<A, string[]>
  ): Observable<string[]> {
    const options = {
      params: new HttpParams({
        fromObject: toPlainObject(queryParams, DatabaseQueryParams.MANIPULATION_FIELDS)
      })
    };

    return this.http.get<A>(`${environment.dreimtUrl}/database/associations/params/${resource}/values`, options)
      .pipe(
        mapper,
        DreimtError.throwOnError('Error retrieving filtering values', 'Filtering values could not be retrieved from the backend.')
      );
  }

  public listGenes(signatureGenesUri: string, onlyUniverseGenes: boolean): Observable<UpDownGenes> {
    const options = {
      params: new HttpParams().set('onlyUniverseGenes', String(onlyUniverseGenes)),
      observe: 'response' as 'response',
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<UpDownGenes>(`${environment.dreimtUrl}/${signatureGenesUri}`, options).pipe(
      DreimtError.throwOnError('Signature query error', 'Signature genes could not be retrieved.'),
      map((response: HttpResponse<UpDownGenes>) => (response.body))
    );
  }

  public downloadCsv(queryParams: DatabaseQueryParams) {
    this.http.get(`${environment.dreimtUrl}/database/associations`, {
      headers: new HttpHeaders({
        'Accept': 'text/csv'
      }),
      responseType: 'blob',
      params: new HttpParams({
        fromObject: toPlainObject(queryParams)
      })
    })
      .pipe(
        DreimtError.throwOnError(
          'Error requesting database predictions',
          `The CSV for the current query could not be retrieved from the backend.`
        )
      )
      .subscribe(res => {
        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, 'database.csv');
      });
  }
}
