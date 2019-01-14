/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2019 - Hugo López-Fernández,
 *  Daniel González-Peña, Miguel Reboiro-Jato, Kevin Troulé,
 *  Fátima Al-Sharhour and Gonzalo Gómez-López.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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
export class CmapResultsTableComponent implements OnInit, AfterViewInit, OnChanges {
  public static readonly DEFAULT_FDR = 0.05;

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public metadata: CmapQueryResultsMetadata;

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

  private readonly routeUrl: string;

  constructor(
    private service: CmapResultsService
  ) {
    this.routeUrl = window.location.href;

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
    this.maxFdrFilter.setValue(CmapResultsTableComponent.DEFAULT_FDR);
  }

  public ngOnInit(): void {
    this.updateResults();
    this.watchForChanges(this.minTesFilter);
    this.watchForChanges(this.maxTesFilter);
    this.watchForChanges(this.maxPvalueFilter);
    this.watchForChanges(this.maxFdrFilter);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.minTesFilter.setValue(null);
    this.maxTesFilter.setValue(null);
    this.maxPvalueFilter.setValue(null);
    this.maxFdrFilter.setValue(CmapResultsTableComponent.DEFAULT_FDR);
    this.resetPage();
    this.updateResults();
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
    this.dataSource.list(this.metadata.id, queryParams);
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
    this.service.listDrugSourceNameValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceDbValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadDrugCommonNames(queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.service.listDrugCommonNameValues(this.metadata.id, queryParams)
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
    this.service.downloadCsv(this.metadata.id, this.createQueryParameters());
  }

  public isMetadataAvailable(): boolean {
    return this.metadata !== undefined;
  }

  public getUpGenesLabel(): string {
    if (this.metadata.downGenesCount === null || this.metadata.downGenesCount === undefined) {
      return 'geneset';
    } else {
      return 'up';
    }
  }

  public getResultsUrl(): string {
    return this.routeUrl;
  }
}
