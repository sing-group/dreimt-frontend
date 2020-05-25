import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {PaginatedDataSource} from '../../../../models/data-source/paginated-data-source';
import {GeneOverlap} from '../../../../models/interactions/jaccard/gene-overlap.model';
import {Subscription} from 'rxjs';
import {JaccardResultsService} from '../../services/jaccard-results.service';

@Component({
  selector: 'app-jaccard-results-signature-summary',
  templateUrl: './jaccard-results-signature-summary.component.html',
  styleUrls: ['./jaccard-results-signature-summary.component.scss']
})
export class JaccardResultsSignatureSummaryComponent implements OnInit, OnChanges {

  @Input() public resultId: string;
  @Input() public title = 'Signatures summary';
  @Input() public dataSource: PaginatedDataSource<GeneOverlap>;

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;
  private computingMaps = false;

  public cellTypeMap: Map<string, Set<string>>;
  public cellSubTypeMap: Map<string, Set<string>>;
  public cellTypeDistribution: Map<string, number>;
  public cellSubTypeDistribution: Map<string, number>;

  constructor(private service: JaccardResultsService) {
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {
        setTimeout(() => {
          this.computingMaps = true;
          const signaturesSet = new Set();
          const tmpCellTypeMap = new Map();
          const tmpCellSubTypeMap = new Map();
          data.map(gO => gO.targetSignatureData).forEach(signature => {
            if (!signaturesSet.has(signature.signatureName)) {
              tmpCellTypeMap.set(signature.signatureName, new Set<string>(signature.cellTypeA.concat(signature.cellTypeB)));
              tmpCellSubTypeMap.set(signature.signatureName, new Set<string>(signature.cellSubTypeA.concat(signature.cellSubTypeA)));
              signaturesSet.add(signature.signatureName);
            }
          });
          this.cellTypeMap = tmpCellTypeMap;
          this.cellSubTypeMap = tmpCellSubTypeMap;
          this.computingMaps = false;
        });
      });
  }

  public ngOnChanges(): void {
    if (this.resultId !== undefined) {
      this.service.cellTypeAndSubTypeDistribution(this.resultId).subscribe(data => {
        this.cellTypeDistribution = data.cellType;
        this.cellSubTypeDistribution = data.cellSubType;
      });
    }
  }

  public ngOnDestroy(): void {
    this.dataSourceSubscription.unsubscribe();
    this.dataSourceSubscription = undefined;
    this.loadingSubscription.unsubscribe();
    this.loadingSubscription = undefined;
  }

  public isLoading(): boolean {
    return this.loading || this.computingMaps;
  }
}
