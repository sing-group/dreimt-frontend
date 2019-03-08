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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InteractionsService} from '../../services/interactions.service';
import {DatabaseDataSource} from './database-data-source';
import {MatPaginator, MatSort} from '@angular/material';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {DrugSignatureInteractionField} from '../../../../models/drug-signature-interaction-field.enum';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';
import {InteractionType} from '../../../../models/interaction-type.enum';

@Component({
  selector: 'app-database',
  templateUrl: './database-table.component.html',
  styleUrls: ['./database-table.component.scss']
})
export class DatabaseTableComponent implements AfterViewInit, OnInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly columns: string[];
  public readonly dataSource: DatabaseDataSource;

  public totalResultsSize: number;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly signatureNameFieldFilter: FieldFilterModel;
  public readonly cellTypeAFieldFilter: FieldFilterModel;
  public readonly cellTypeBFieldFilter: FieldFilterModel;
  public readonly cellSubTypeAFieldFilter: FieldFilterModel;
  public readonly cellSubTypeBFieldFilter: FieldFilterModel;
  public readonly diseaseFieldFilter: FieldFilterModel;
  public readonly organismFieldFilter: FieldFilterModel;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel;
  public readonly pubMedIdFieldFilter: FieldFilterModel;
  public readonly drugSourceNameFieldFilter: FieldFilterModel;
  public readonly drugSourceDbFieldFilter: FieldFilterModel;
  public readonly experimentalDesignFilter: FieldFilterModel;
  public readonly interactionTypeFilter: FieldFilterModel;
  public readonly minTauFilter: FormControl;
  public readonly maxUpFdrFilter: FormControl;
  public readonly maxDownFdrFilter: FormControl;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  constructor(
    private service: InteractionsService
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new DatabaseDataSource(this.service);
    this.columns = [
      'drug', 'signature', 'tau', 'upFdr', 'downFdr',
      'interactionType', 'experimentalDesign', 'cellTypeA', 'cellTypeB', 'cellSubtypeA', 'cellSubtypeB',
      'disease', 'organism', 'article', 'signatureSourceDb', 'drugSourceName', 'drugSourceDb'
    ];

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.signatureNameFieldFilter = new FieldFilterModel();
    this.cellTypeAFieldFilter = new FieldFilterModel();
    this.cellTypeBFieldFilter = new FieldFilterModel();
    this.cellSubTypeAFieldFilter = new FieldFilterModel();
    this.cellSubTypeBFieldFilter = new FieldFilterModel();
    this.diseaseFieldFilter = new FieldFilterModel();
    this.organismFieldFilter = new FieldFilterModel();
    this.signatureSourceDbFieldFilter = new FieldFilterModel();
    this.pubMedIdFieldFilter = new FieldFilterModel();
    this.drugSourceNameFieldFilter = new FieldFilterModel();
    this.drugSourceDbFieldFilter = new FieldFilterModel();
    this.experimentalDesignFilter = new FieldFilterModel();
    this.interactionTypeFilter = new FieldFilterModel();
    this.minTauFilter = new FormControl();
    this.maxUpFdrFilter = new FormControl();
    this.maxDownFdrFilter = new FormControl();
  }

  public ngOnInit(): void {
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxUpFdrFilter);
    this.watchForChanges(this.maxDownFdrFilter);
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
    this.dataSource.list(queryParams);
  }

  public updateInteractions(): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
    this.loadDrugCommonNames(queryParams);
    this.loadSignatureNames(queryParams);
    this.loadCellTypeAs(queryParams);
    this.loadCellTypeBs(queryParams);
    this.loadCellSubTypeAs(queryParams);
    this.loadCellSubTypeBs(queryParams);
    this.loadDiseases(queryParams);
    this.loadOrganisms(queryParams);
    this.loadSignatureSourceDbs(queryParams);
    this.loadSignaturePubMedIds(queryParams);
    this.loadDrugSourceDbs(queryParams);
    this.loadDrugSourceNames(queryParams);
    this.loadExperimentalDesigns(queryParams);
    this.loadInteractionTypes(queryParams);
  }

  private loadDrugCommonNames(queryParams: DatabaseQueryParams): void {
    this.service.listDrugCommonNameValues(queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private loadSignatureNames(queryParams: DatabaseQueryParams): void {
    this.service.listSignatureNameValues(queryParams)
      .subscribe(values => this.signatureNameFieldFilter.update(values));
  }

  private loadCellTypeAs(queryParams: DatabaseQueryParams): void {
    this.service.listCellTypeAValues(queryParams)
      .subscribe(values => this.cellTypeAFieldFilter.update(values));
  }

  private loadCellTypeBs(queryParams: DatabaseQueryParams): void {
    this.service.listCellTypeBValues(queryParams)
      .subscribe(values => this.cellTypeBFieldFilter.update(values));
  }

  private loadCellSubTypeAs(queryParams: DatabaseQueryParams): void {
    this.service.listCellSubTypeAValues(queryParams)
      .subscribe(values => this.cellSubTypeAFieldFilter.update(values));
  }

  private loadCellSubTypeBs(queryParams: DatabaseQueryParams): void {
    this.service.listCellSubTypeBValues(queryParams)
      .subscribe(values => this.cellSubTypeBFieldFilter.update(values));
  }

  private loadDiseases(queryParams: DatabaseQueryParams): void {
    this.service.listDiseaseValues(queryParams)
      .subscribe(values => this.diseaseFieldFilter.update(values));
  }

  private loadOrganisms(queryParams: DatabaseQueryParams): void {
    this.service.listOrganismValues(queryParams)
      .subscribe(values => this.organismFieldFilter.update(values));
  }

  private loadSignatureSourceDbs(queryParams: DatabaseQueryParams): void {
    this.service.listSignatureSourceDbValues(queryParams)
      .subscribe(values => this.signatureSourceDbFieldFilter.update(values));
  }

  private loadSignaturePubMedIds(queryParams: DatabaseQueryParams): void {
    this.service.listSignaturePubMedIdValues(queryParams)
      .subscribe(values => this.pubMedIdFieldFilter.update(values));
  }

  private loadDrugSourceNames(queryParams: DatabaseQueryParams): void {
    this.service.listDrugSourceNameValues(queryParams)
      .subscribe(values => this.drugSourceNameFieldFilter.update(values));
  }

  private loadDrugSourceDbs(queryParams: DatabaseQueryParams): void {
    this.service.listDrugSourceDbValues(queryParams)
      .subscribe(values => this.drugSourceDbFieldFilter.update(values));
  }

  private loadExperimentalDesigns(queryParams: DatabaseQueryParams): void {
    this.service.listExperimentalDesignValues(queryParams)
      .subscribe(values => this.experimentalDesignFilter.update(values));
  }

  private loadInteractionTypes(queryParams: DatabaseQueryParams): void {
    this.service.listInteractionTypes(queryParams)
      .subscribe(values => this.interactionTypeFilter.update(values));
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

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): DatabaseQueryParams {
    const experimentalDesign = this.experimentalDesignFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFilter.getClearedFilter()]
      : undefined;

    const interactionType = this.interactionTypeFilter.hasValue()
      ? InteractionType[this.interactionTypeFilter.getClearedFilter()]
      : undefined;

    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      signatureName: this.signatureNameFieldFilter.getClearedFilter(),
      cellTypeA: this.cellTypeAFieldFilter.getClearedFilter(),
      cellTypeB: this.cellTypeBFieldFilter.getClearedFilter(),
      cellSubTypeA: this.cellSubTypeAFieldFilter.getClearedFilter(),
      cellSubTypeB: this.cellSubTypeBFieldFilter.getClearedFilter(),
      disease: this.diseaseFieldFilter.getClearedFilter(),
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      signaturePubMedId: this.pubMedIdFieldFilter.getClearedFilter(),
      drugSourceName: this.drugSourceNameFieldFilter.getClearedFilter(),
      drugSourceDb: this.drugSourceDbFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      interactionType: interactionType,
      minTau: this.minTauFilter.value,
      maxUpFdr: this.maxUpFdrFilter.value,
      maxDownFdr: this.maxDownFdrFilter.value,
    };
  }
}
