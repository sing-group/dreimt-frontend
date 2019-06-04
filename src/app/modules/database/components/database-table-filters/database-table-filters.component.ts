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

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {FormControl} from '@angular/forms';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {InteractionsService} from '../../services/interactions.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';

@Component({
  selector: 'app-database-table-filters',
  templateUrl: './database-table-filters.component.html',
  styleUrls: ['./database-table-filters.component.scss']
})
export class DatabaseTableFiltersComponent implements OnInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public freeTextFilter: string;
  public isAdvancedPanelOpened: boolean;

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
  public readonly experimentalDesignFilter: FieldFilterModel;
  public readonly interactionTypeFilter: FieldFilterModel;
  public readonly minTauFilter: FormControl;
  public readonly maxUpFdrFilter: FormControl;
  public readonly maxDownFdrFilter: FormControl;

  @ViewChild('tauMin') minTauFilterComponent: NumberFieldComponent;
  @ViewChild('maxUpFdr') maxUpFdrFilterComponent: NumberFieldComponent;
  @ViewChild('maxDownFdr') maxDownFdrFilterComponent: NumberFieldComponent;

  @Output() public readonly applyDatabaseFilters: EventEmitter<DatabaseQueryParams>;

  constructor(private service: InteractionsService) {
    this.debounceTime = 500;
    this.maxOptions = 100;

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
    this.experimentalDesignFilter = new FieldFilterModel();
    this.interactionTypeFilter = new FieldFilterModel();
    this.minTauFilter = new FormControl();
    this.maxUpFdrFilter = new FormControl();
    this.maxDownFdrFilter = new FormControl();

    this.applyDatabaseFilters = new EventEmitter<DatabaseQueryParams>();
  }

  ngOnInit() {
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxUpFdrFilter);
    this.watchForChanges(this.maxDownFdrFilter);
    this.updateFilterValues();
  }

  private watchForChanges(field: FormControl): void {
    field.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(() => this.updateFilterValues());
  }

  public updateFilterValues(): void {
    const queryParams = this.createQueryParameters();

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

  private loadExperimentalDesigns(queryParams: DatabaseQueryParams): void {
    this.service.listExperimentalDesignValues(queryParams)
      .subscribe(values => this.experimentalDesignFilter.update(values));
  }

  private loadInteractionTypes(queryParams: DatabaseQueryParams): void {
    this.service.listInteractionTypes(queryParams)
      .subscribe(values => this.interactionTypeFilter.update(values));
  }

  public applyFiltersAction(): void {
    if (this.isAdvancedPanelOpened) {
      this.applyDatabaseFilters.emit(this.createQueryParameters());
    } else {
      this.applyDatabaseFilters.emit({freeText: this.freeTextFilter});
    }
  }

  private createQueryParameters(): DatabaseQueryParams {
    const experimentalDesign = this.experimentalDesignFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFilter.getClearedFilter()]
      : undefined;

    const interactionType = this.interactionTypeFilter.hasValue()
      ? InteractionType[this.interactionTypeFilter.getClearedFilter()]
      : undefined;

    return {
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
      experimentalDesign: experimentalDesign,
      interactionType: interactionType,
      minTau: this.minTauFilter.value,
      maxUpFdr: this.maxUpFdrFilter.value,
      maxDownFdr: this.maxDownFdrFilter.value,
    };
  }

  public applyFreeTextFilter(): void {
    this.applyFiltersAction();
  }

  public advancedPanelOpened(): void {
    this.isAdvancedPanelOpened = true;
  }

  public advancedPanelClosed(): void {
    this.isAdvancedPanelOpened = false;
  }

  public clearAdvancedFiltersAction(): void {
    this.drugCommonNameFieldFilter.filter = '';
    this.signatureNameFieldFilter.filter = '';
    this.cellTypeAFieldFilter.filter = '';
    this.cellTypeBFieldFilter.filter = '';
    this.cellSubTypeAFieldFilter.filter = '';
    this.cellSubTypeBFieldFilter.filter = '';
    this.diseaseFieldFilter.filter = '';
    this.organismFieldFilter.filter = '';
    this.signatureSourceDbFieldFilter.filter = '';
    this.pubMedIdFieldFilter.filter = '';
    this.drugSourceNameFieldFilter.filter = '';
    this.experimentalDesignFilter.filter = '';
    this.interactionTypeFilter.filter = '';

    this.minTauFilterComponent.clearValue();
    this.maxUpFdrFilterComponent.clearValue();
    this.maxDownFdrFilterComponent.clearValue();
  }

  public clearFreeTextFilterValue(): void {
    this.freeTextFilter = '';
  }
}
