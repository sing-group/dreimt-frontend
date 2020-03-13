import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DreimtError} from '../modules/notification/entities';
import {DreimtInformationModel} from '../models/dreimt-information.model';

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
        DreimtError.throwOnError('Error retrieving Dreimt database information', `The Dreimt database information could not be retrieved`),
      );
  }
}
