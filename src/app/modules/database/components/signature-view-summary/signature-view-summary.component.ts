import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SignatureViewDataSource} from '../signature-view/signature-view-data-source';
import {Subscription} from 'rxjs';
import {DrugSummary, SummaryElement, SummaryHelper} from '../../../../models/interactions/cmap/cmap-result-summary.model';
import {CmapUpDownSignatureDrugInteraction} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

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

        const bestBoth: DrugSummary[] = data
          .filter(interaction => interaction.downFdr !== null && interaction.upFdr !== null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && (interaction.downFdr <= 0.05 || interaction.upFdr <= 0.05))
          .map(this.mapInteraction);

        const goodBoth: DrugSummary[] = data
          .filter(interaction => interaction.downFdr !== null && interaction.upFdr !== null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.downFdr > 0.05 && interaction.upFdr > 0.05)
          .map(this.mapInteraction);

        const bestBothMap = SummaryHelper.mapDrugSummaryArray(bestBoth);
        const goodBothMap = SummaryHelper.mapDrugSummaryArray(goodBoth);

        const bestUp: DrugSummary[] = data
          .filter(interaction => interaction.downFdr === null && interaction.upFdr !== null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.upFdr <= 0.05)
          .map(this.mapInteraction);

        const goodUp: DrugSummary[] = data
          .filter(interaction => interaction.downFdr === null && interaction.upFdr !== null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.upFdr > 0.05)
          .map(this.mapInteraction);

        const bestUpMap = SummaryHelper.mapDrugSummaryArray(bestUp);
        const goodUpMap = SummaryHelper.mapDrugSummaryArray(goodUp);

        const bestDown: DrugSummary[] = data
          .filter(interaction => interaction.downFdr !== null && interaction.upFdr === null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.downFdr <= 0.05)
          .map(this.mapInteraction);

        const goodDown: DrugSummary[] = data
          .filter(interaction => interaction.downFdr !== null && interaction.upFdr === null)
          .filter(interaction => Math.abs(interaction.tau) >= 90 && interaction.downFdr > 0.05)
          .map(this.mapInteraction);

        const bestDownMap = SummaryHelper.mapDrugSummaryArray(bestDown);
        const goodDownMap = SummaryHelper.mapDrugSummaryArray(goodDown);

        this.summaryDataSource =
          SummaryHelper.mapToSummaryElement(bestBothMap, 'Best (Up and Down)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES)
            .concat(SummaryHelper.mapToSummaryElement(goodBothMap, 'Good (Up and Down)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES))
            .concat(SummaryHelper.mapToSummaryElement(bestUpMap, 'Best (Up)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES))
            .concat(SummaryHelper.mapToSummaryElement(goodUpMap, 'Good (Up)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES))
            .concat(SummaryHelper.mapToSummaryElement(bestDownMap, 'Best (Down)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES))
            .concat(SummaryHelper.mapToSummaryElement(goodDownMap, 'Good (Down)', SignatureViewSummaryComponent.TOP_N_MOA_VALUES));
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

  private mapInteraction(interaction: CmapUpDownSignatureDrugInteraction) {
    return {
      status: interaction.drug.status,
      moa: interaction.drug.moa
    };
  }
}
