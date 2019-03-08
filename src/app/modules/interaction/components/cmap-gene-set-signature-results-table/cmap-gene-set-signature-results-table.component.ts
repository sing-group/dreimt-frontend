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
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';
import {CmapGeneSetSignatureResultsDataSource} from './cmap-gene-set-signature-results-data-source';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';
import {CmapGeneSetSignatureResultField} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-result-field.enum';
import {CmapGeneSetSignatureDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results-query-params';

@Component({
  selector: 'app-cmap-gene-set-signature-results-table',
  templateUrl: './cmap-gene-set-signature-results-table.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-table.component.scss']
})
export class CmapGeneSetSignatureResultsTableComponent implements OnInit, AfterViewInit, OnChanges {
  public static readonly DEFAULT_FDR = 0.05;

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public metadata: CmapQueryGeneSetSignatureResultsMetadata;

  public readonly columns: string[];
  public readonly dataSource: CmapGeneSetSignatureResultsDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly drugSourceNameFieldFilter: FieldFilterModel;
  public readonly drugSourceDbFieldFilter: FieldFilterModel;
  public readonly minTauFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  private readonly routeUrl: string;

  constructor(
    private service: CmapGeneSetResultsService
  ) {
    this.routeUrl = window.location.href;

    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new CmapGeneSetSignatureResultsDataSource(this.service);
    this.columns = [
      'tau', 'fdr', 'drugSourceName', 'drugCommonName', 'drugSourceDb'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.drugSourceNameFieldFilter = new FieldFilterModel();
    this.drugSourceDbFieldFilter = new FieldFilterModel();
    this.minTauFilter = new FormControl();
    this.maxFdrFilter = new FormControl();
    this.maxFdrFilter.setValue(CmapGeneSetSignatureResultsTableComponent.DEFAULT_FDR);
  }

  public ngOnInit(): void {
    this.updateResults();
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxFdrFilter);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.minTauFilter.setValue(null);
    this.maxFdrFilter.setValue(CmapGeneSetSignatureResultsTableComponent.DEFAULT_FDR);
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

  private orderField(): CmapGeneSetSignatureResultField {
    if (this.sortDirection() !== undefined) {
      return CmapGeneSetSignatureResultField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private loadDrugSourceNames(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceNameValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceDbValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadDrugCommonNames(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugCommonNameValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): CmapGeneSetSignatureDrugInteractionResultsQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      minTau: this.minTauFilter.value,
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

  public getResultsUrl(): string {
    return this.routeUrl;
  }

  public getInitialFdrValue(): number {
    return CmapGeneSetSignatureResultsTableComponent.DEFAULT_FDR;
  }
}