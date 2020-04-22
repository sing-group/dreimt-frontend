import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CmapUpDownSignatureResultsDataSource} from '../cmap-up-down-signature-results-view/cmap-up-down-signature-results-data-source';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CmapUpDownSignatureDrugInteraction} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';


@Component({
  selector: 'app-cmap-up-down-signature-results-summary',
  templateUrl: './cmap-up-down-signature-results-summary.component.html',
  styleUrls: ['./cmap-up-down-signature-results-summary.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CmapUpDownSignatureResultsSummaryComponent implements OnInit, OnDestroy {

  @Input() public dataSource: CmapUpDownSignatureResultsDataSource;

  public resultsArray: CmapUpDownSignatureDrugInteraction[];

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
