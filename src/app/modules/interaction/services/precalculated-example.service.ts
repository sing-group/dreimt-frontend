import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {PrecalculatedExample} from '../../../models/interactions/precalculated-example.model';

@Injectable({
  providedIn: 'root'
})
export class PrecalculatedExampleService {

  constructor(
    private http: HttpClient
  ) {
  }

  public listJaccardPrecalculatedExamples(): Observable<PrecalculatedExample[]> {
    return this.listPrecalculatedExamples('signatures-comparison');
  }

  public listCmapPrecalculatedExamples(): Observable<PrecalculatedExample[]> {
    return this.listPrecalculatedExamples('drug-prioritization');
  }

  private listPrecalculatedExamples(type: string): Observable<PrecalculatedExample[]> {
    const options = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.get<PrecalculatedExample[]>(
      `${environment.dreimtUrl}/examples/` + type, options
    ).pipe(
      DreimtError.throwOnError('Precalculated examples error', 'Precalculated examples could not be retrieved.')
    );
  }
}
