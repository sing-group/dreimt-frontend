import {Component, Input} from '@angular/core';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';
import {CmapGeneSetSignatureResultsDataSource} from './cmap-gene-set-signature-results-data-source';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';
import {CmapUpDownResultsService} from '../../services/cmap-up-down-results.service';
import {ActivatedRoute} from '@angular/router';
import {CmapUpDownSignatureResultsDataSource} from '../cmap-up-down-signature-results-view/cmap-up-down-signature-results-data-source';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-cmap-gene-set-signature-results-view',
  templateUrl: './cmap-gene-set-signature-results-view.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-view.component.scss']
})
export class CmapGeneSetSignatureResultsViewComponent {

  private metadata: CmapQueryGeneSetSignatureResultsMetadata;
  private dataSource: CmapGeneSetSignatureResultsDataSource;
  private readonly routeUrl: string;
  private errorMessage: string;

  constructor(
    private service: CmapGeneSetResultsService,
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
        this.dataSource = new CmapGeneSetSignatureResultsDataSource(this.service);
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
