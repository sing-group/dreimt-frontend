import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SignatureViewDataSource} from '../signature-view/signature-view-data-source';
import {Subscription} from 'rxjs';
import {DrugSummary, SummaryElement, SummaryHelper} from '../../../../models/interactions/cmap/cmap-result-summary.model';
import {CmapUpDownSignatureDrugInteraction} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';

@Component({
  selector: 'app-signature-view-summary',
  templateUrl: './signature-view-summary.component.html',
  styleUrls: ['./signature-view-summary.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SignatureViewSummaryComponent implements OnInit, OnDestroy {
  private static TOP_N_MOA_VALUES = 5;

  @Input() public dataSource: SignatureViewDataSource;

  public resultsArray: DrugCellDatabaseInteraction[];

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
