import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {GeneOverlapField} from '../../../../models/interactions/jaccard/gene-overlap-field.enum';
import {CmapDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap/cmap-drug-interaction-results-query-params';
import {CmapResultsDataSource} from './cmap-results-data-source';
import {CmapResultsService} from '../../services/cmap-results.service';
import {CmapResultField} from '../../../../models/interactions/cmap/cmap-result-field.enum';
import {CmapQueryResultsMetadata} from '../../../../models/interactions/cmap/cmap-query-results-metadata';
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';

@Component({
  selector: 'app-cmap-results-table',
  templateUrl: './cmap-results-table.component.html',
  styleUrls: ['./cmap-results-table.component.scss']
})
export class CmapResultsTableComponent implements OnInit, AfterViewInit {
  public readonly DEFAULT_FDR = 0.05;

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input('resultId') resultId: string;
  @Input('cmapResultMetadata') cmapResultMetadata: CmapQueryResultsMetadata;

  public readonly columns: string[];
  public readonly dataSource: CmapResultsDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly drugSourceNameFieldFilter: FieldFilterModel;
  public readonly drugSourceDbFieldFilter: FieldFilterModel;
  public readonly minTesFilter: FormControl;
  public readonly maxTesFilter: FormControl;
  public readonly maxPvalueFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  constructor(
    private service: CmapResultsService
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new CmapResultsDataSource(this.service);
    this.columns = [
      'tes', 'pValue', 'fdr', 'drugSourceName', 'drugCommonName', 'drugSourceDb'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.drugSourceNameFieldFilter = new FieldFilterModel();
    this.drugSourceDbFieldFilter = new FieldFilterModel();
    this.minTesFilter = new FormControl();
    this.maxTesFilter = new FormControl();
    this.maxPvalueFilter = new FormControl();
    this.maxFdrFilter = new FormControl();
    this.maxFdrFilter.setValue(this.DEFAULT_FDR);
  }

  public ngOnInit(): void {
    this.updateResults();
    this.watchForChanges(this.minTesFilter);
    this.watchForChanges(this.maxTesFilter);
    this.watchForChanges(this.maxPvalueFilter);
    this.watchForChanges(this.maxFdrFilter);
  }

  private watchForChanges(field: FormControl): void {
    field.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(() => this.updateResults());
  }

  private resetPage(): void {
    this.paginator.pageIndex = 0;
  }

  private updatePage(queryParams = this.createQueryParameters()): void {
    this.dataSource.list(this.resultId, queryParams);
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
  }

  public updateResults(): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
    this.loadDrugCommonNames(queryParams);
    this.loadDrugSourceNames(queryParams);
    this.loadDrugSourceDbs(queryParams);
  }

  public ngAfterViewInit(): void {
    this.sort.sortChange.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => {
      this.resetPage();
      this.updatePage();
    });

    this.paginator.page.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => this.updatePage());
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

  private orderField(): GeneOverlapField {
    if (this.sortDirection() !== undefined) {
      return CmapResultField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private loadDrugSourceNames(queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceNameValues(this.resultId, queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceDbValues(this.resultId, queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadDrugCommonNames(queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.service.listDrugCommonNameValues(this.resultId, queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): CmapDrugInteractionResultsQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      minTes: this.minTesFilter.value,
      maxTes: this.maxTesFilter.value,
      maxPvalue: this.maxPvalueFilter.value,
      maxFdr: this.maxFdrFilter.value,
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      drugSourceName: this.drugSourceNameFieldFilter.getClearedFilter(),
      drugSourceDb: this.drugSourceDbFieldFilter.getClearedFilter()
    };
  }

  public downloadCsv() {
    this.service.downloadCsv(this.resultId, this.createQueryParameters());
  }

  public isMetadataAvailable(): boolean {
    return this.cmapResultMetadata !== undefined;
  }

  public getUpGenesLabel(): string {
    if (this.cmapResultMetadata.downGenesCount === null || this.cmapResultMetadata.downGenesCount === undefined) {
      return 'geneset';
    } else {
      return 'up';
    }
  }
}
