import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DreimtError} from '../modules/notification/entities';
import {DreimtInformationModel} from '../models/dreimt-information.model';
import {DreimtStatsModel} from '../models/dreimt-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DreimtInformationService {

  public constructor(
    private http: HttpClient
  ) {
  }

  public getDreimtInformation(): Observable<DreimtInformationModel> {
    return this.http.get<DreimtInformationModel>(`${environment.dreimtUrl}/database/information`)
      .pipe(
        DreimtError.throwOnError('Error retrieving DREIMT database information', `The DREIMT database information could not be retrieved`),
      );
  }

  public getDreimtStats(): Observable<DreimtStatsModel> {
    return this.http.get<DreimtStatsModel>(`${environment.dreimtUrl}/database/statistics`)
      .pipe(
        DreimtError.throwOnError('Error retrieving DREIMT database statistics', `The DREIMT database statistics could not be retrieved`),
      );
  }

  public getCurrentDatabaseVersion(): Observable<string> {
    return this.http.get(`${environment.dreimtUrl}/database/versions/current`, {responseType: 'text'})
      .pipe(
        DreimtError.throwOnError('Error retrieving database version', `The current database version could not be retrieved`),
      );
  }
}
