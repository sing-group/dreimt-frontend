import {Component, Input} from '@angular/core';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
import {CmapUpDownSignatureResultsDataSource} from './cmap-up-down-signature-results-data-source';
import {CmapUpDownResultsService} from '../../services/cmap-up-down-results.service';
import {ActivatedRoute} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-cmap-up-down-signature-results-view',
  templateUrl: './cmap-up-down-signature-results-view.component.html',
  styleUrls: ['./cmap-up-down-signature-results-view.component.scss']
})
export class CmapUpDownSignatureResultsViewComponent {

  private metadata: CmapQueryUpDownSignatureResultsMetadata;
  private dataSource: CmapUpDownSignatureResultsDataSource;
  private readonly routeUrl: string;
  private errorMessage: string;

  constructor(
    private service: CmapUpDownResultsService,
    private route: ActivatedRoute
  ) {
    this.routeUrl = window.location.href;
    const uuid = this.route.snapshot.params['uuid'];
    if (uuid) {
      this.service.getMetadata(uuid)
        .pipe(
          catchError(
            (error: Error) => {
              this.errorMessage = 'Error loading drug prioritization result with id = ' + uuid;
              return throwError(error);
            }
          ))
        .subscribe(metadata => {
          this.metadata = metadata;
          this.metadata.id = uuid;
          this.dataSource = new CmapUpDownSignatureResultsDataSource(this.service);
        });
    }
  }

  public getResultsUrl(): string {
    return this.routeUrl;
  }

  public isMetadataAvailable(): boolean {
    return this.metadata !== undefined;
  }

  public isError(): boolean {
    return this.errorMessage !== undefined;
  }
}
