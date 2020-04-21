import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CmapUpDownSignatureResultsDataSource} from '../cmap-up-down-signature-results-view/cmap-up-down-signature-results-data-source';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CmapUpDownSignatureDrugInteraction} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';
import {DrugSummary, SummaryElement, SummaryHelper} from '../../../../models/interactions/cmap/cmap-result-summary.model';


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
  private static TOP_N_MOA_VALUES = 5;

  @Input() public dataSource: CmapUpDownSignatureResultsDataSource;

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

        const best: DrugSummary[][] = data
          .filter(interaction => Math.abs(interaction.tau) >= 90 && (interaction.downFdr <= 0.05 || interaction.upFdr <= 0.05))
          .map(this.mapInteraction);
        const bestFlatten = [].concat(...best);

        const good: DrugSummary[][] = data
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.downFdr > 0.05 && interaction.upFdr > 0.05)
          .map(this.mapInteraction);
        const goodFlatten = [].concat(...good);

        const bestMap = SummaryHelper.mapDrugSummaryArray(bestFlatten);
        const goodMap = SummaryHelper.mapDrugSummaryArray(goodFlatten);

        this.summaryDataSource = SummaryHelper.mapToSummaryElement(bestMap, 'Best', CmapUpDownSignatureResultsSummaryComponent.TOP_N_MOA_VALUES)
          .concat(SummaryHelper.mapToSummaryElement(goodMap, 'Good', CmapUpDownSignatureResultsSummaryComponent.TOP_N_MOA_VALUES));
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

  private mapInteraction(interaction: CmapUpDownSignatureDrugInteraction): DrugSummary[] {
    return interaction.drug.moa.map(moa =>
      ({
        status: interaction.drug.status,
        moa: moa
      }));
  }
}
