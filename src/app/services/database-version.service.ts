import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {DreimtError} from '../modules/notification/entities';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CmapUpDownSignatureDrugInteraction} from '../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseVersionService {

  public constructor(
    private http: HttpClient
  ) {
  }

  public getCurrentDatabaseVersion(): Observable<string> {
    return this.http.get(`${environment.dreimtUrl}/versions/database/current`, {responseType: 'text'})
      .pipe(
        DreimtError.throwOnError('Error retrieving database version', `The current database version could not be retrieved`),
      );
  }
}
