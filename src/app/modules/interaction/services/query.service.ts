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
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DrugCellInteractionModel} from '../models/drug-cell-interaction.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {CmapSignatureQueryParams, GeneSet, QueryParams, UpDownGenes} from '../models/signature-query-params.model';
import {WorkModel} from '../models/work.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  public constructor(
    private http: HttpClient
  ) {
  }

  public list(): Observable<DrugCellInteractionModel[]> {
    return this.http.get<DrugCellInteractionModel[]>(
      `${environment.dreimtUrl}/interaction`
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell interactions could not be retrieved.')
    );
  }

  /*
   * TODO: this method should return something like an Observable<Work>
   */
  public launchQuery(queryParams: QueryParams): Observable<WorkModel> {
    let body: {
      upGenes: string[];
      downGenes?: string[];
    };

    if (UpDownGenes.isUpDownGenes(queryParams.genes)) {
      body = {upGenes: queryParams.genes.upGenes, downGenes: queryParams.genes.downGenes};
    } else if (GeneSet.isGeneSet(queryParams.genes)) {
      body = {upGenes: queryParams.genes.genes};
    }

    let analysisResource: string;
    if (CmapSignatureQueryParams.isCmapSignatureQueryParams(queryParams.params)) {
      analysisResource = 'cmap';
    } else {
      analysisResource = 'jaccard';
    }

    const options = {
      params: new HttpParams({
        fromObject: QueryParams.toPlainObject(queryParams.params)
      })
    };

    return this.http.post<WorkModel>(
      `${environment.dreimtUrl}/interactions/query/${analysisResource}`, body, options
    ).pipe(
      DreimtError.throwOnError('Drug-Cell error', 'Drug-cell interactions could not be retrieved.')
    );
  }
}
