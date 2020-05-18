import {Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {SignatureViewDataSource} from '../signature-view/signature-view-data-source';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {FormControl} from '@angular/forms';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';
import {Subscription} from 'rxjs';
import {InteractionsService} from '../../services/interactions.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {ExportGenesDialogComponent} from '../../../shared/components/export-genes-dialog/export-genes-dialog.component';
import {FileFormat, GenesHelper} from '../../../../models/helpers/genes.helper';
import saveAs from 'file-saver';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {DrugSignatureInteractionField} from '../../../../models/drug-signature-interaction-field.enum';
import {SignaturesSummaryHelper} from '../../helpers/SignaturesSummaryHelper';
import {CellSignature} from '../../../../models/database/cell-signature.model';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {formatTitle} from '../../../../utils/types';

@Component({
  selector: 'app-signature-view-table',
  templateUrl: './signature-view-table.component.html',
  styleUrls: ['./signature-view-table.component.scss']
})
export class SignatureViewTableComponent implements OnDestroy, OnChanges {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public signature: CellSignature;
  @Input() public dataSource: SignatureViewDataSource;
  @Input() public tauThreshold: number;

  public columns: string[];

  public totalResultsSize: number;

  @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) private sort: MatSort;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly drugMoaFieldFilter: FieldFilterModel;
  public readonly drugStatusFieldFilter: FieldFilterModel;
  public readonly minDrugDssFilter: FormControl;
  public readonly minTauFilter: FormControl;
  public readonly maxUpFdrFilter: FormControl;
  public readonly maxDownFdrFilter: FormControl;
  public readonly interactionTypeFilter: FieldFilterModel;

  @ViewChild('minDrugDss', {static: false}) minDrugDssFilterComponent: NumberFieldComponent;
  @ViewChild('minTau', {static: false}) minTauFilterComponent: NumberFieldComponent;
  @ViewChild('maxUpFdr', {static: false}) maxUpFdrFilterComponent: NumberFieldComponent;
  @ViewChild('maxDownFdr', {static: false}) maxDownFdrFilterComponent: NumberFieldComponent;

  private positiveTauColorMap;
  private negativeTauColorMap;

  private readonly signaturesSummaryHelper = new SignaturesSummaryHelper();

  private subscriptions: Subscription[] = [];

  constructor(
    private service: InteractionsService,
    public dialog: MatDialog
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.drugMoaFieldFilter = new FieldFilterModel();
    this.drugStatusFieldFilter = new FieldFilterModel();
    this.interactionTypeFilter = new FieldFilterModel();
    this.minDrugDssFilter = new FormControl();
    this.minTauFilter = new FormControl();
    this.maxUpFdrFilter = new FormControl();
    this.maxDownFdrFilter = new FormControl();

    const interpolate = require('color-interpolate');
    this.positiveTauColorMap = interpolate(['tomato', 'red']);
    this.negativeTauColorMap = interpolate(['lightgreen', 'darkgreen']);
  }


  private updateSort(active: string, sortDirection): void {
    this.sort.direction = sortDirection;
    this.sort.active = active;
    this.updateSortUI(active, sortDirection);
  }

  /*
   * This function is a workaround to solve the bug in the sort header component that does not update its UI when the active sort and
   * direction are changed programmatically. More information at: https://github.com/angular/components/issues/10242
   */
  private updateSortUI(active: string, sortDirection): void {
    this.sort.sortChange.emit();
    this.sort._stateChanges.next();

    const _SortHeader = this.sort.sortables.get(active) as MatSortHeader;
    if (_SortHeader !== undefined) {
      _SortHeader['_setAnimationTransitionState']({
        fromState: sortDirection,
        toState: 'active',
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.initColumns();
    this.cancelWatchForChanges();
    this.clearColumnModifiers();
    this.initSort();
    this.resetPage();
    this.updateResults();
    this.initWatchForChanges();
  }

  private initColumns() {
    if (!this.columns) {
      if (this.signature.signatureType === 'UPDOWN') {
        this.columns = [
          'drug', 'summary', 'upFdr', 'downFdr', 'tau', 'drugDss', 'drugStatus', 'drugMoa', 'interactionType'
        ];
      } else {
        this.columns = [
          'drug', 'summary', 'upFdr', 'tau', 'drugDss', 'drugStatus', 'drugMoa', 'interactionType'
        ];
      }
    }
  }

  private cancelWatchForChanges() {
    this.subscriptions.forEach(function (value) {
      value.unsubscribe();
    });
    this.subscriptions = [];
  }

  private clearColumnModifiers(): void {
    if (this.minDrugDssFilterComponent) {
      this.minDrugDssFilterComponent.clearValue();
    }
    if (this.minTauFilterComponent) {
      this.minTauFilterComponent.clearValue();
    }
    if (this.maxUpFdrFilterComponent) {
      this.maxUpFdrFilterComponent.clearValue();
    }
    if (this.maxDownFdrFilterComponent) {
      this.maxDownFdrFilterComponent.clearValue();
    }

    this.minDrugDssFilter.setValue(null);
    this.minTauFilter.setValue(this.tauThreshold);
    this.maxUpFdrFilter.setValue(null);
    this.maxDownFdrFilter.setValue(null);
  }

  private initSort(): void {
    this.updateSort('TAU', 'desc');
  }

  private initWatchForChanges() {
    this.watchForChanges(this.minDrugDssFilter);
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxUpFdrFilter);
    this.watchForChanges(this.maxDownFdrFilter);

    this.subscriptions.push(
      this.sort.sortChange.pipe(
        debounceTime(this.debounceTime)
      ).subscribe(() => {
        this.resetPage();
        this.updatePage();
      }));

    this.subscriptions.push(
      this.paginator.page.pipe(
        debounceTime(this.debounceTime)
      ).subscribe(() => this.updatePage())
    );
  }

  private watchForChanges(field: FormControl): void {
    this.subscriptions.push(
      field.valueChanges
        .pipe(
          debounceTime(this.debounceTime),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          this.updateResults();
        })
    );
  }

  private resetPage(): void {
    this.paginator.pageIndex = 0;
  }

  private updatePage(queryParams = this.createQueryParameters()): void {
    this.dataSource.list(queryParams);
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
  }

  public updateResults(): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
    this.loadDrugCommonNameValues(queryParams);
    this.loadDrugMoaValues(queryParams);
    this.loadDrugStatusValues(queryParams);
    this.loadInteractionTypeValues(queryParams);
  }

  public ngOnDestroy(): void {
    this.cancelWatchForChanges();
  }

  private sortDirection(): SortDirection {
    switch (this.sort.direction) {
      case 'asc':
        return SortDirection.ASCENDING;
      case 'desc':
        return SortDirection.DESCENDING;
      default:
        return undefined;
    }
  }

  private orderField(): DrugSignatureInteractionField {
    if (this.sortDirection() !== undefined) {
      return DrugSignatureInteractionField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private loadDrugMoaValues(queryParams: DatabaseQueryParams): void {
    this.service.listDrugMoaValues(queryParams)
      .subscribe(values => this.drugMoaFieldFilter.update(values));
  }

  private loadDrugStatusValues(queryParams: DatabaseQueryParams): void {
    this.service.listDrugStatusValues(queryParams)
      .subscribe(values => this.drugStatusFieldFilter.update(values));
  }

  private loadDrugCommonNameValues(queryParams: DatabaseQueryParams): void {
    this.service.listDrugCommonNameValues(queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private loadInteractionTypeValues(queryParams: DatabaseQueryParams): void {
    this.service.listInteractionTypeValues(queryParams)
      .subscribe(values => this.interactionTypeFilter.update(values));
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): DatabaseQueryParams {
    const interactionType = this.interactionTypeFilter.hasValue()
      ? InteractionType[this.interactionTypeFilter.getClearedFilter()]
      : undefined;

    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      minTau: this.minTauFilter.value,
      maxUpFdr: this.maxUpFdrFilter.value,
      maxDownFdr: this.maxDownFdrFilter.value,
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      drugMoa: this.drugMoaFieldFilter.getClearedFilter(),
      drugStatus: this.drugStatusFieldFilter.getClearedFilter(),
      minDrugDss: this.minDrugDssFilter.value,
      signatureName: this.signature.signatureName,
      interactionType: interactionType
    };
  }

  openDownloadGenesDialog(): void {
    const dialogRef = this.dialog.open(ExportGenesDialogComponent, {
      width: '380px',
      data: {
        title: 'Export signature genes',
        onlyUniverseGenes: false,
        fileFormats: [FileFormat.GMT, FileFormat.GMX],
        fileFormat: FileFormat.GMT
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.downloadGenes(result.onlyUniverseGenes, result.fileFormat);
      }
    });
  }

  private downloadGenes(onlyUniverseGenes: boolean, fileFormat: FileFormat) {
    this.service.listGenes(this.signature.signatureGenesUri, onlyUniverseGenes).subscribe(result => {
      this.saveGenes(result, fileFormat);
    });
  }

  private saveGenes(genes: UpDownGenes | GeneSet, fileFormat: FileFormat) {
    let fileName = '';
    const fileExtension = FileFormat.getFileExtension(fileFormat);
    const queryTitle = this.signature.signatureName;
    fileName = queryTitle.replace(/\s/g, '_') + '.' + fileExtension;

    const fileContents = GenesHelper.formatGenes(genes, fileFormat);

    const blob = new Blob([fileContents], {type: 'text/plain'});
    saveAs(blob, fileName);
  }

  public getTauStyleColor(tau: number): string {
    if (tau >= 90) {
      return this.positiveTauColorMap((tau - 90) / 10);
    } else if (tau <= -90) {
      return this.negativeTauColorMap((Math.abs(tau) - 90) / 10);
    } else {
      return 'black';
    }
  }

  public minDrugDssFilterChanged(event): void {
    this.updateFilter(this.minDrugDssFilter, event);
  }

  public minTauFilterChanged(event): void {
    this.updateFilter(this.minTauFilter, event);
  }

  public maxUpFdrFilterChanged(event): void {
    this.updateFilter(this.maxUpFdrFilter, event);
  }

  public maxDownFdrFilterChanged(event): void {
    this.updateFilter(this.maxDownFdrFilter, event);
  }

  private updateFilter(filter: FormControl, event) {
    if (filter.value !== undefined && filter.value !== event) {
      filter.setValue(event);
    }
  }

  public drugTooltip(interaction: DrugCellDatabaseInteraction): string {
    let tooltip = 'Source name: ' + interaction.drug.sourceName;
    if (interaction.drug.targetGenes.length > 0) {
      tooltip = tooltip + '\nTarget genes: ' + interaction.drug.targetGenes;
    }

    return tooltip;
  }

  public getSummary(interaction: DrugCellDatabaseInteraction): string {
    return this.signaturesSummaryHelper.getInteractionSummary(interaction);
  }

  public getInteractionTypeAcronym(interactionType: InteractionType): string {
    switch (interactionType) {
      case InteractionType.GENESET:
        return 'G';
      case InteractionType.SIGNATURE:
        return 'S';
      case InteractionType.SIGNATURE_UP:
        return 'UP';
      case InteractionType.SIGNATURE_DOWN:
        return 'DN';
    }
  }

  public mapInteractionType(interactionType: string): string {
    return formatTitle(interactionType);
  }
}
