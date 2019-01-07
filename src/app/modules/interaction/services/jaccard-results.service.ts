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

@Injectable({
  providedIn: 'root'
})
export class JaccardResultsService {

  constructor(
    private http: HttpClient
  ) {
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
      DreimtError.throwOnError('Jaccard results error', 'Jaccard analysis results could not be retrieved.'),
      map((response: HttpResponse<GeneOverlap[]>) => ({
        result: response.body,
        count: Number(response.headers.get('X-Count'))
      }))
    );
  }

  public downloadCsv(resultId: string, queryParams: JaccardOverlapsQueryParams) {
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
        const blob = new Blob([res], {type: 'text/csv'});
        saveAs(blob, 'Jaccard_' + resultId + '.csv');
      });
  }
}
