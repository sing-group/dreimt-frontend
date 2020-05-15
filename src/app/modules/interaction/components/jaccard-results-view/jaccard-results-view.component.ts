import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JaccardQueryResultMetadata} from '../../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {JaccardResultsDataSource} from '../jaccard-results-table/jaccard-results-data-source';
import {JaccardResultsService} from '../../services/jaccard-results.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-jaccard-results-view',
  templateUrl: './jaccard-results-view.component.html',
  styleUrls: ['./jaccard-results-view.component.scss']
})
export class JaccardResultsViewComponent {

  private metadata: JaccardQueryResultMetadata;
  private dataSource: JaccardResultsDataSource;
  private readonly routeUrl: string;
  private errorMessage: string;

  constructor(
    private service: JaccardResultsService,
    private route: ActivatedRoute
  ) {
    this.routeUrl = window.location.href;
    const uuid = this.route.snapshot.params['uuid'];
    if (uuid) {
      this.service.getMetadata(uuid)
        .pipe(
          catchError(
            (error: Error) => {
              this.errorMessage = 'Error loading signatures comparison result with id = ' + uuid;
              return throwError(error);
            }
          ))
        .subscribe(metadata => {
          this.metadata = metadata;
          this.metadata.id = uuid;
          this.dataSource = new JaccardResultsDataSource(this.service);
        });
    }
  }

  public hasDatabaseSignatureFilters(): boolean {
    return this.hasValue(this.metadata.cellType1)
      || this.hasValue(this.metadata.cellType2)
      || this.hasValue(this.metadata.cellSubType1)
      || this.hasValue(this.metadata.cellSubType2)
      || this.hasValue(this.metadata.cellTypeOrSubType1)
      || this.hasValue(this.metadata.cellTypeOrSubType1)
      || this.hasValue(this.metadata.disease)
      || this.hasValue(this.metadata.experimentalDesign)
      || this.hasValue(this.metadata.organism)
      || this.hasValue(this.metadata.signatureSourceDb);
  }

  private hasValue(value: string): boolean {
    if (value) {
      return true;
    } else {
      return false;
    }
  }

  public getUpGenesLabel(): string {
    if (this.metadata.downGenesCount === null || this.metadata.downGenesCount === undefined) {
      return 'geneset';
    } else {
      return 'up';
    }
  }

  public formatQueryParameter(object: Object): string {
    if (object === null || object === undefined) {
      return 'not used';
    } else {
      return object.toString();
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
