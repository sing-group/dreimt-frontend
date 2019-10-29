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
import {MatExpansionPanel} from '@angular/material';
import {FilterFieldComponent} from '../../../shared/components/filter-field/filter-field.component';

@Component({
  selector: 'app-database-table-filters',
  templateUrl: './database-table-filters.component.html',
  styleUrls: ['./database-table-filters.component.scss']
})
export class DatabaseTableFiltersComponent implements OnInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  private previousDatabaseQueryParams: DatabaseQueryParams = undefined;

  public readonly drugCommonNameFieldFilter: FieldFilterModel;
  public readonly signatureNameFieldFilter: FieldFilterModel;
  public readonly cellType1FieldFilter: FieldFilterModel;
  public readonly cellType2FieldFilter: FieldFilterModel;
  public readonly cellSubType1FieldFilter: FieldFilterModel;
  public readonly cellSubType2FieldFilter: FieldFilterModel;
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

  @ViewChild('cellType2') private cellType2Component: FilterFieldComponent;
  @ViewChild('cellSubType2') private cellSubType2Component: FilterFieldComponent;
  @ViewChild('tauMin') minTauFilterComponent: NumberFieldComponent;
  @ViewChild('maxUpFdr') maxUpFdrFilterComponent: NumberFieldComponent;
  @ViewChild('maxDownFdr') maxDownFdrFilterComponent: NumberFieldComponent;

  @Output() public readonly applyDatabaseFilters: EventEmitter<DatabaseQueryParams>;

  constructor(private service: InteractionsService) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.drugCommonNameFieldFilter = new FieldFilterModel();
    this.signatureNameFieldFilter = new FieldFilterModel();
    this.cellType1FieldFilter = new FieldFilterModel();
    this.cellType2FieldFilter = new FieldFilterModel();
    this.cellSubType1FieldFilter = new FieldFilterModel();
    this.cellSubType2FieldFilter = new FieldFilterModel();
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
    this.checkCellTypeAndSubType2FiltersStatus();

    const queryParams = this.createQueryParameters();

    if (!DatabaseQueryParams.equals(queryParams, this.previousDatabaseQueryParams)) {
      this.loadDrugCommonNames(queryParams);
      this.loadSignatureNames(queryParams);
      this.loadCellType1s(queryParams);
      this.loadCellSubType1s(queryParams);
      this.loadDiseases(queryParams);
      this.loadOrganisms(queryParams);
      this.loadSignatureSourceDbs(queryParams);
      this.loadSignaturePubMedIds(queryParams);
      this.loadDrugSourceNames(queryParams);
      this.loadExperimentalDesigns(queryParams);
      this.loadInteractionTypes(queryParams);

      if (this.cellType1FieldFilter.getClearedFilter()) {
        this.loadCellType2s(queryParams);
      }

      if (this.cellSubType1FieldFilter.getClearedFilter()) {
        this.loadCellSubType2s(queryParams);
      }

      this.previousDatabaseQueryParams = queryParams;
      this.applyDatabaseFilters.emit(queryParams);
    }
  }

  private checkCellTypeAndSubType2FiltersStatus(): void {
    if (this.cellType1FieldFilter.getClearedFilter()) {
      this.cellType2Component.enable();
    } else {
      this.cellType2FieldFilter.filter = '';
      this.cellType2Component.disable();
    }

    if (this.cellSubType1FieldFilter.getClearedFilter()) {
      this.cellSubType2Component.enable();
    } else {
      this.cellSubType2FieldFilter.filter = '';
      this.cellSubType2Component.disable();
    }
  }

  private loadDrugCommonNames(queryParams: DatabaseQueryParams): void {
    this.service.listDrugCommonNameValues(queryParams)
      .subscribe(values => this.drugCommonNameFieldFilter.update(values));
  }

  private loadSignatureNames(queryParams: DatabaseQueryParams): void {
    this.service.listSignatureNameValues(queryParams)
      .subscribe(values => this.signatureNameFieldFilter.update(values));
  }

  private loadCellType1s(queryParams: DatabaseQueryParams): void {
    this.service.listCellType1Values(queryParams)
      .subscribe(values => this.cellType1FieldFilter.update(values));
  }

  private loadCellType2s(queryParams: DatabaseQueryParams): void {
    this.service.listCellType2Values(queryParams)
      .subscribe(values => this.cellType2FieldFilter.update(values));
  }

  private loadCellSubType1s(queryParams: DatabaseQueryParams): void {
    this.service.listCellSubType1Values(queryParams)
      .subscribe(values => this.cellSubType1FieldFilter.update(values));
  }

  private loadCellSubType2s(queryParams: DatabaseQueryParams): void {
    this.service.listCellSubType2Values(queryParams)
      .subscribe(values => this.cellSubType2FieldFilter.update(values));
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
      cellType1: this.cellType1FieldFilter.getClearedFilter(),
      cellType2: this.cellType2FieldFilter.getClearedFilter(),
      cellSubType1: this.cellSubType1FieldFilter.getClearedFilter(),
      cellSubType2: this.cellSubType2FieldFilter.getClearedFilter(),
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

  public clearFiltersAction(): void {
    this.drugCommonNameFieldFilter.filter = '';
    this.signatureNameFieldFilter.filter = '';
    this.cellType1FieldFilter.filter = '';
    this.cellType2FieldFilter.filter = '';
    this.cellSubType1FieldFilter.filter = '';
    this.cellSubType2FieldFilter.filter = '';
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

  public setSignatureFilter(signatureParam: string): void {
    this.signatureNameFieldFilter.filter = signatureParam;
  }
}
