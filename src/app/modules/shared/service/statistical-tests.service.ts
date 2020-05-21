import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {HypergeometricDataModel} from '../../../models/hypergeometric-data.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';

@Injectable({
  providedIn: 'root'
})
export class StatisticalTestsService {

  public constructor(
    private http: HttpClient
  ) {
  }

  public hypergeometricTest(data: HypergeometricDataModel[]): Observable<HypergeometricDataModel[]> {
    const body = {
      data: data
    };

    return this.http.post<HypergeometricDataModel[]>(
      `${environment.dreimtUrl}/statistical/tests/hypergeometric`, body
    ).pipe(
      DreimtError.throwOnError('Test error',
        (error: HttpErrorResponse) => 'Statistical tests error: ' + error.error)
    );
  }
}
