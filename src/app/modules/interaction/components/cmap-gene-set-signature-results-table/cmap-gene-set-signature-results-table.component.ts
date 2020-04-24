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

import {Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatSortHeader} from '@angular/material';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';
import {CmapGeneSetSignatureResultsDataSource} from '../cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-data-source';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';
import {CmapGeneSetSignatureResultField} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-result-field.enum';
import {CmapGeneSetSignatureDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction-results-query-params';
import {ExportGenesDialogComponent} from '../../../shared/components/export-genes-dialog/export-genes-dialog.component';
import {FileFormat, GenesHelper} from '../../../../models/helpers/genes.helper';
import saveAs from 'file-saver';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';
import {Subscription} from 'rxjs';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cmap-gene-set-signature-results-table',
  templateUrl: './cmap-gene-set-signature-results-table.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-table.component.scss']
})
export class CmapGeneSetSignatureResultsTableComponent implements OnDestroy, OnChanges {
  private static DEFAULT_TAU_FILTER = 75;

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public metadata: CmapQueryGeneSetSignatureResultsMetadata;

  public readonly columns: string[];
  @Input() public dataSource: CmapGeneSetSignatureResultsDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly drugMoaFieldFilter: FieldFilterModel;
  public readonly minTauFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  @ViewChild('tauMin') minTauFilterComponent: NumberFieldComponent;
  @ViewChild('maxFdr') maxFdrFilterComponent: NumberFieldComponent;

  private positiveTauColorMap;
  private negativeTauColorMap;

  private readonly routeUrl: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private service: CmapGeneSetResultsService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.routeUrl = window.location.href;

    this.debounceTime = 500;
    this.maxOptions = 100;

    this.columns = [
      'drugCommonName', 'tau', 'fdr', 'drugMoa'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.drugMoaFieldFilter = new FieldFilterModel();
    this.minTauFilter = new FormControl();
    this.maxFdrFilter = new FormControl();

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
    this.cancelWatchForChanges();
    this.clearColumnModifiers();
    this.initSort();
    this.resetPage();
    this.updateResults();
    this.initWatchForChanges();
  }

  private cancelWatchForChanges() {
    this.subscriptions.forEach(function (value) {
      value.unsubscribe();
    });
    this.subscriptions = [];
  }

  private clearColumnModifiers(): void {
    if (this.minTauFilterComponent) {
      this.minTauFilterComponent.clearValue();
    }
    if (this.maxFdrFilterComponent) {
      this.maxFdrFilterComponent.clearValue();
    }

    this.minTauFilter.setValue(CmapGeneSetSignatureResultsTableComponent.DEFAULT_TAU_FILTER);
    this.maxFdrFilter.setValue(null);
  }

  private initSort(): void {
    this.updateSort('TAU', 'desc');
  }

  private initWatchForChanges() {
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxFdrFilter);

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
    this.dataSource.list(this.metadata.id, queryParams);
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
  }

  public updateResults(): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
    this.loadDrugCommonNames(queryParams);
    this.loadDrugMoas(queryParams);
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

  private orderField(): CmapGeneSetSignatureResultField {
    if (this.sortDirection() !== undefined) {
      return CmapGeneSetSignatureResultField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private loadDrugMoas(queryParams: CmapGeneSetSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugMoas(this.metadata.id, queryParams)
      .subscribe(values => this.drugMoaFieldFilter.update(values));
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
      drugMoa: this.drugMoaFieldFilter.getClearedFilter(),
    };
  }

  public downloadCsv() {
    this.service.downloadCsv(this.metadata.id, this.metadata.queryTitle, this.createQueryParameters());
  }

  public isMetadataAvailable(): boolean {
    return this.metadata !== undefined;
  }

  public getResultsUrl(): string {
    return this.routeUrl;
  }

  openDownloadGenesDialog(): void {
    const dialogRef = this.dialog.open(ExportGenesDialogComponent, {
      width: '380px',
      data: {
        title: 'Export query genes',
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
    this.service.listGenes(this.metadata.id, onlyUniverseGenes).subscribe(result => {
      this.saveGenes(result, fileFormat);
    });
  }

  private saveGenes(genes: UpDownGenes | GeneSet, fileFormat: FileFormat) {
    let fileName = '';
    const fileExtension = FileFormat.getFileExtension(fileFormat);
    const queryTitle = this.metadata.queryTitle;
    if (!queryTitle) {
      fileName = 'Drug_Prioritization_Query_Genes_' + this.metadata.id + '.' + fileExtension;
    } else {
      fileName = queryTitle.replace(/\s/g, '_') + '.' + fileExtension;
    }

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

  public minTauFilterChanged(event): void {
    this.updateFilter(this.minTauFilter, event);
  }

  public maxFdrFilterChanged(event): void {
    this.updateFilter(this.maxFdrFilter, event);
  }

  private updateFilter(filter: FormControl, event) {
    if (filter.value !== undefined && filter.value !== event) {
      filter.setValue(event);
    }
  }

  public drugTooltip(interaction: DrugCellDatabaseInteraction): string {
    let tooltip = 'Source name: ' + interaction.drug.sourceName;
    tooltip = tooltip + '\nStatus: ' + interaction.drug.status;
    if (interaction.drug.targetGenes.length > 0) {
      tooltip = tooltip + '\nTarget genes: ' + interaction.drug.targetGenes;
    }

    return tooltip;
  }

  public navigateToDatabase(drugCommonName: string): void {
    this.router.navigate(['/database'], {queryParams: {drugCommonName: drugCommonName}});
  }
}

