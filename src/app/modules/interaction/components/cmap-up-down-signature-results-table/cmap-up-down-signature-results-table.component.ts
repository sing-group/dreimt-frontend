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
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {CmapUpDownSignatureDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction-results-query-params';
import {CmapUpDownSignatureResultsDataSource} from './cmap-up-down-signature-results-data-source';
import {CmapResultsService} from '../../services/cmap-results.service';
import {CmapUpDownSignatureResultField} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-result-field.enum';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {ExportGenesDialogComponent} from '../export-genes-dialog/export-genes-dialog.component';
import {FileFormat, GenesHelper} from '../../../../models/helpers/genes.helper';
import saveAs from 'file-saver';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';

@Component({
  selector: 'app-cmap-up-down-signature-results-table',
  templateUrl: './cmap-up-down-signature-results-table.component.html',
  styleUrls: ['./cmap-up-down-signature-results-table.component.scss']
})
export class CmapUpDownSignatureResultsTableComponent implements OnInit, AfterViewInit, OnChanges {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input() public metadata: CmapQueryUpDownSignatureResultsMetadata;

  public readonly columns: string[];
  public readonly dataSource: CmapUpDownSignatureResultsDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly drugSourceNameFieldFilter: FieldFilterModel;
  public readonly drugSourceDbFieldFilter: FieldFilterModel;
  public readonly minTauFilter: FormControl;
  public readonly maxUpFdrFilter: FormControl;
  public readonly maxDownFdrFilter: FormControl;

  private readonly routeUrl: string;

  constructor(
    private service: CmapResultsService,
    public dialog: MatDialog
  ) {
    this.routeUrl = window.location.href;

    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new CmapUpDownSignatureResultsDataSource(this.service);
    this.columns = [
      'tau', 'upFdr', 'downFdr', 'drugSourceName', 'drugCommonName', 'drugSourceDb'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.drugSourceNameFieldFilter = new FieldFilterModel();
    this.drugSourceDbFieldFilter = new FieldFilterModel();
    this.minTauFilter = new FormControl();
    this.maxUpFdrFilter = new FormControl();
    this.maxDownFdrFilter = new FormControl();
  }

  public ngOnInit(): void {
    this.initSort();
    this.updateResults();
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxUpFdrFilter);
    this.watchForChanges(this.maxDownFdrFilter);
  }

  public initSort(): void {
    this.sort.active = 'TAU';
    this.sort.direction = 'desc';
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.minTauFilter.setValue(null);
    this.maxUpFdrFilter.setValue(null);
    this.maxDownFdrFilter.setValue(null);
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

  private orderField(): CmapUpDownSignatureResultField {
    if (this.sortDirection() !== undefined) {
      return CmapUpDownSignatureResultField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private loadDrugSourceNames(queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceNameValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugSourceDbValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadDrugCommonNames(queryParams: CmapUpDownSignatureDrugInteractionResultsQueryParams): void {
    this.service.listDrugCommonNameValues(this.metadata.id, queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): CmapUpDownSignatureDrugInteractionResultsQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      minTau: this.minTauFilter.value,
      maxUpFdr: this.maxUpFdrFilter.value,
      maxDownFdr: this.maxDownFdrFilter.value,
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      drugSourceName: this.drugSourceNameFieldFilter.getClearedFilter(),
      drugSourceDb: this.drugSourceDbFieldFilter.getClearedFilter()
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
      fileName = 'Predictions_Query_Genes_' + this.metadata.id + '.' + fileExtension;
    } else {
      fileName = queryTitle.replace(/\s/g, '_') + '.' + fileExtension;
    }

    const fileContents = GenesHelper.formatGenes(genes, fileFormat);

    const blob = new Blob([fileContents], {type: 'text/plain'});
    saveAs(blob, fileName);
  }
}
