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
import {JaccardResultsDataSource} from './jaccard-results-data-source';
import {JaccardResultsService} from '../../services/jaccard-results.service';
import {MatDialog, MatPaginator, MatSort, MatSortHeader} from '@angular/material';
import {JaccardOverlapsQueryParams} from '../../../../models/interactions/jaccard/jaccard-overlaps-query-params';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {GeneOverlapField} from '../../../../models/interactions/jaccard/gene-overlap-field.enum';
import {JaccardQueryResultMetadata} from '../../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {FormControl} from '@angular/forms';
import saveAs from 'file-saver';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {ExportGenesDialogComponent} from '../../../shared/components/export-genes-dialog/export-genes-dialog.component';
import {FileFormat, GenesHelper} from '../../../../models/helpers/genes.helper';
import {Router} from '@angular/router';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-jaccard-results-table',
  templateUrl: './jaccard-results-table.component.html',
  styleUrls: ['./jaccard-results-table.component.scss']
})
export class JaccardResultsTableComponent implements OnDestroy, OnChanges {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public dataSource: JaccardResultsDataSource;
  @Input() public metadata: JaccardQueryResultMetadata;

  public readonly columns: string[];

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly minJaccardFilter: FormControl;
  public readonly maxPvalueFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  @ViewChild('jaccardMin') minJaccardFilterComponent: NumberFieldComponent;
  @ViewChild('maxPvalue') maxPvalueFilterComponent: NumberFieldComponent;
  @ViewChild('maxFdr') maxFdrFilterComponent: NumberFieldComponent;

  private readonly routeUrl: string;

  private subscriptions: Subscription[] = [];

  public constructor(
    private service: JaccardResultsService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.routeUrl = window.location.href;

    this.debounceTime = 500;
    this.maxOptions = 100;

    this.columns = [
      'sourceComparisonType', 'targetComparisonType', 'targetSignature', 'pValue', 'fdr', 'jaccard'
    ];

    this.minJaccardFilter = new FormControl();
    this.maxPvalueFilter = new FormControl();
    this.maxFdrFilter = new FormControl();
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
    if (this.minJaccardFilterComponent) {
      this.minJaccardFilterComponent.clearValue();
    }
    if (this.maxFdrFilterComponent) {
      this.maxFdrFilterComponent.clearValue();
    }
    if (this.maxPvalueFilterComponent) {
      this.maxPvalueFilterComponent.clearValue();
    }

    this.minJaccardFilter.setValue(null);
    this.maxPvalueFilter.setValue(null);
    this.maxFdrFilter.setValue(null);
  }

  private initSort(): void {
    this.updateSort('JACCARD', 'desc');
  }

  private initWatchForChanges() {
    this.watchForChanges(this.minJaccardFilter);
    this.watchForChanges(this.maxPvalueFilter);
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

  private orderField(): GeneOverlapField {
    if (this.sortDirection() !== undefined) {
      return GeneOverlapField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): JaccardOverlapsQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      minJaccard: this.minJaccardFilter.value,
      maxPvalue: this.maxPvalueFilter.value,
      maxFdr: this.maxFdrFilter.value,
    };
  }

  public downloadCsv() {
    this.service.downloadCsv(this.metadata.id, this.metadata.queryTitle, this.createQueryParameters());
  }

  openDownloadGenesDialog(): void {
    const dialogRef = this.dialog.open(ExportGenesDialogComponent, {
      width: '380px',
      data: {
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
      fileName = 'Jaccard_Genes_' + this.metadata.id + '.' + fileExtension;
    } else {
      fileName = queryTitle.replace(/\s/g, '_') + '.' + fileExtension;
    }

    const fileContents = GenesHelper.formatGenes(genes, fileFormat);

    const blob = new Blob([fileContents], {type: 'text/plain'});
    saveAs(blob, fileName);
  }

  public navigateToSignature(signature: string): void {
    this.router.navigate(['/database/signature'], {queryParams: {signature: signature}});
  }

  public minJaccardFilterChanged(event): void {
    this.updateFilter(this.minJaccardFilter, event);
  }

  public maxPvalueFilterChanged(event): void {
    this.updateFilter(this.maxPvalueFilter, event);
  }

  public maxFdrFilterChanged(event): void {
    this.updateFilter(this.maxFdrFilter, event);
  }

  private updateFilter(filter: FormControl, event) {
    if (filter.value !== undefined && filter.value !== event) {
      filter.setValue(event);
    }
  }
}
