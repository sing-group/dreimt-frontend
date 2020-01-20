import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DrugSummary, SummaryElement, SummaryHelper} from '../../../../models/interactions/cmap/cmap-result-summary.model';
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
  private static TOP_N_MOA_VALUES = 5;

  @Input() public dataSource: CmapGeneSetSignatureResultsDataSource;

  constructor() {
  }

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;

  columnsToDisplay = ['candidates', 'drugStatus', 'count'];
  displayedMoaColumns = ['moa', 'moaCount'];

  summaryDataSource: SummaryElement[];

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {

        const best: DrugSummary[] = data
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.fdr <= 0.05)
          .map(this.mapInteraction);

        const good: DrugSummary[] = data
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.fdr > 0.05)
          .map(this.mapInteraction);


        const bestMap = SummaryHelper.mapDrugSummaryArray(best);
        const goodMap = SummaryHelper.mapDrugSummaryArray(good);

        this.summaryDataSource = SummaryHelper.mapToSummaryElement(bestMap, 'Best', CmapGeneSetSignatureResultsSummaryComponent.TOP_N_MOA_VALUES)
          .concat(SummaryHelper.mapToSummaryElement(goodMap, 'Good', CmapGeneSetSignatureResultsSummaryComponent.TOP_N_MOA_VALUES));
      });
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

  private mapInteraction(interaction: CmapGeneSetSignatureDrugInteraction) {
    return {
      status: interaction.drug.status,
      moa: interaction.drug.moa
    };
  }
}
