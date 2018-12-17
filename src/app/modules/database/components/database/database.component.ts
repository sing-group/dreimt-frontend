/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018 - Hugo López-Fernández,
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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InteractionsService} from '../../services/interactions.service';
import {DatabaseDataSource} from './database-data-source';
import {MatPaginator, MatSort} from '@angular/material';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DrugSignatureInteractionQueryParams, ExperimentalDesign} from '../../models/drug-signature-interaction-query-params.model';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {merge} from 'rxjs';
import {SortDirection} from '../../models/sort-direction.model';
import {DrugSignatureInteractionField} from '../../models/drug-signature-interaction-field.model';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements AfterViewInit, OnInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly columns: string[];
  public readonly dataSource: DatabaseDataSource;

  public totalResultsSize: number;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly cellTypeAFieldFilter: FieldFilterModel;
  public readonly cellTypeBFieldFilter: FieldFilterModel;
  public readonly diseaseFieldFilter: FieldFilterModel;
  public readonly organismFieldFilter: FieldFilterModel;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel;
  public readonly drugSourceNameFieldFilter: FieldFilterModel;
  public readonly drugSourceDbFieldFilter: FieldFilterModel;
  public readonly experimentalDesignFilter: FieldFilterModel;
  public readonly minTesFilter: FormControl;
  public readonly maxTesFilter: FormControl;
  public readonly maxPvalueFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  constructor(
    private service: InteractionsService
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new DatabaseDataSource(this.service);
    this.columns = [
      'drug', 'signature', 'tes', 'pValue', 'fdr',
      'signatureType', 'experimentalDesign', 'cellTypeA', 'cellTypeB', 'cellSubtypeA', 'cellSubtypeB',
      'disease', 'organism', 'article', 'signatureSourceDb', 'drugSourceName', 'drugSourceDb'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.cellTypeAFieldFilter = new FieldFilterModel();
    this.cellTypeBFieldFilter = new FieldFilterModel();
    this.diseaseFieldFilter = new FieldFilterModel();
    this.organismFieldFilter = new FieldFilterModel();
    this.signatureSourceDbFieldFilter = new FieldFilterModel();
    this.drugSourceNameFieldFilter = new FieldFilterModel();
    this.drugSourceDbFieldFilter = new FieldFilterModel();
    this.experimentalDesignFilter = new FieldFilterModel();
    this.minTesFilter = new FormControl();
    this.maxTesFilter = new FormControl();
    this.maxPvalueFilter = new FormControl();
    this.maxFdrFilter = new FormControl();
  }

  public ngOnInit(): void {
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
    this.watchForChanges(this.minTesFilter);
    this.watchForChanges(this.maxTesFilter);
    this.watchForChanges(this.maxPvalueFilter);
    this.watchForChanges(this.maxFdrFilter);
    this.updateInteractions();
  }

  private watchForChanges(field: FormControl): void {
    field.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(() => this.updateInteractions());
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

  public getExperimentalDesignValues(): string[] {
    return Object.keys(ExperimentalDesign)
      .filter(key => !isNaN(Number(ExperimentalDesign[key])));
  }

  private resetPage(): void {
    this.paginator.pageIndex = 0;
  }

  private updatePage(queryParams = this.createQueryParameters()): void {
    console.log('updatepage');
    this.dataSource.list(queryParams);
  }

  public updateInteractions(resetPage = true): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
    console.log('loadfields');
    this.loadDrugCommonNames(queryParams);
    this.loadCellTypeAs(queryParams);
    this.loadCellTypeBs(queryParams);
    this.loadDiseases(queryParams);
    this.loadOrganisms(queryParams);
    this.loadSignatureSourceDbs(queryParams);
    this.loadDrugSourceDbs(queryParams);
    this.loadDrugSourceNames(queryParams);
    this.loadExperimentalDesigns(queryParams);
  }

  private loadDrugCommonNames(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listDrugCommonNameValues(queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private loadCellTypeAs(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listCellTypeAValues(queryParams)
      .subscribe(values => this.cellTypeAFieldFilter.update(values));
  }

  private loadCellTypeBs(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listCellTypeBValues(queryParams)
      .subscribe(values => this.cellTypeBFieldFilter.update(values));
  }

  private loadDiseases(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listDiseaseValues(queryParams)
      .subscribe(values => this.diseaseFieldFilter.update(values));
  }

  private loadOrganisms(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listOrganismValues(queryParams)
      .subscribe(values => this.organismFieldFilter.update(values));
  }

  private loadSignatureSourceDbs(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listSignatureSourceDbValues(queryParams)
      .subscribe(values => this.signatureSourceDbFieldFilter.update(values));
  }

  private loadDrugSourceNames(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listDrugSourceNameValues(queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listDrugSourceDbValues(queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadExperimentalDesigns(queryParams: DrugSignatureInteractionQueryParams): void {
    this.service.listExperimentalDesignValues(queryParams)
      .subscribe(values => this.experimentalDesignFilter.update(values));
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

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): DrugSignatureInteractionQueryParams {
    const experimentalDesign = this.experimentalDesignFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFilter.getClearedFilter()]
      : undefined;

    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      cellTypeA: this.cellTypeAFieldFilter.getClearedFilter(),
      cellTypeB: this.cellTypeBFieldFilter.getClearedFilter(),
      disease: this.diseaseFieldFilter.getClearedFilter(),
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      drugSourceName: this.drugSourceNameFieldFilter.getClearedFilter(),
      drugSourceDb: this.drugSourceDbFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      minTes: this.minTesFilter.value,
      maxTes: this.maxTesFilter.value,
      maxPvalue: this.maxPvalueFilter.value,
      maxFdr: this.maxFdrFilter.value
    };
  }
}
