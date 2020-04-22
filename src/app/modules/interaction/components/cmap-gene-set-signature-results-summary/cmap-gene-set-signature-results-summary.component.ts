import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CmapGeneSetSignatureDrugInteraction} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {CmapGeneSetSignatureResultsDataSource} from '../cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-data-source';

@Component({
  selector: 'app-cmap-gene-set-signature-results-summary',
  templateUrl: './cmap-gene-set-signature-results-summary.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-summary.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CmapGeneSetSignatureResultsSummaryComponent implements OnInit, OnDestroy {

  @Input() public dataSource: CmapGeneSetSignatureResultsDataSource;

  public resultsArray: CmapGeneSetSignatureDrugInteraction[];

  constructor() {
  }

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(data => this.resultsArray = data);
  }

  public ngOnDestroy(): void {
    this.dataSourceSubscription.unsubscribe();
    this.dataSourceSubscription = undefined;
    this.loadingSubscription.unsubscribe();
    this.loadingSubscription = undefined;
  }

  public isLoading(): boolean {
    return this.loading;
  }
}
