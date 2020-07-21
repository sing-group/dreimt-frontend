/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2020 - Hugo López-Fernández,
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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {FormControl} from '@angular/forms';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {InteractionsService} from '../../services/interactions.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';
import {FilterFieldComponent} from '../../../shared/components/filter-field/filter-field.component';
import {FieldFilterCellTypeModel} from '../../../shared/components/filter-field/field-filter-cell-type.model';
import {ParamMap} from '@angular/router';
import {DrugEffect} from '../../../../models/database/drug-effect.enum';
import {formatTitle} from '../../../../utils/types';

@Component({
  selector: 'app-database-table-filters',
  templateUrl: './database-table-filters.component.html',
  styleUrls: ['./database-table-filters.component.scss']
})
export class DatabaseTableFiltersComponent implements OnInit {
  public readonly TOOLTIP_WARNING_CELL_TYPE_1 = 'This filter is disabled, the cell type/subtype 1 must be selected to enable it.';
  public readonly TOOLTIP_CELL_TYPE_1 = 'Specify an immune cell type of interest.';
  public readonly TOOLTIP_DRUG = 'Specify a drug of interest.';
  public readonly TOOLTIP_MIN_TAU = 'Specify a minimum threshold tau score value. Works in absolute values.';
  public readonly TOOLTIP_MAX_UP_FDR = 'Specify a maximum threshold FDR value for the upregulated genes.';
  public readonly TOOLTIP_MAX_DOWN_FDR = 'Specify a maximum threshold FDR value for the downregulated genes.';
  public readonly TOOLTIP_INTERACTION_TYPE = 'Specify if you are interested in filtering associations made with the ' +
    'complete immune signature (Signature), only the upregulated genes (Signature up), only the downregulated genes (Signature down) ' +
    'or geneset (genes with no specified direction).';
  public readonly TOOLTIP_DRUG_MOA = 'Specify the mechanism of action of the drug.';
  public readonly TOOLTIP_DRUG_STATUS = 'Specify the drug status of the drug (approved, experimental or withdrawn).';
  public readonly TOOLTIP_DRUG_DSS = 'Specify a minimum threshold DSS value for the drugs.';
  public readonly TOOLTIP_DRUG_EFFECT = 'Specify the desired (inhibition/boosting) effect over the Cell type/subtype 1 selected.';
  public readonly TOOLTIP_SIGNATURE_NAME = 'Specify the name of the signature of interest.';
  public readonly TOOLTIP_SIGNATURE_SOURCE_DB = 'Specify a database source of signatures.';
  public readonly TOOLTIP_SIGNATURE_PUBMED = 'Specify a PubMed ID to filter signatures from a specific publication.';
  public readonly TOOLTIP_SIGNATURE_EXPERIMENTAL_DESIGN = 'Specify the experimental design to retrieve the signature ' +
    '(in vitro, in vivo, patient...).';
  public readonly TOOLTIP_SIGNATURE_CELL_TYPE_1_DISEASE = 'Specify the disease associated with the selected cell type 1.';
  public readonly TOOLTIP_SIGNATURE_CELL_TYPE_1_TREATMENT = 'Specify the treatment applied to the selected cell type 1.';
  public readonly TOOLTIP_SIGNATURE_CELL_TYPE_2 = 'Specify an immune cell type of interest. This filter is used in combination with the ' +
    'cell type/subtype 1 filter. With both filters applied results will display signatures derived from the comparison of the two ' +
    'specific cell types.';
  public readonly TOOLTIP_SIGNATURE_CONDITION = 'Specify a treatment or disease applied to generate the signature.';
  public readonly TOOLTIP_SIGNATURE_ORGANISM = 'Specify the organism source of the immune cells. ';

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public isAdvancedPanelOpened: boolean;

  public readonly drugCommonNameFieldFilter: FieldFilterModel<string>;
  public readonly drugMoaFieldFilter: FieldFilterModel<string>;
  public readonly drugStatusFieldFilter: FieldFilterModel<string>;

  public readonly signatureNameFieldFilter: FieldFilterModel<string>;
  public readonly cellType1EffectFieldFilter: FieldFilterModel<string>;
  public readonly cellType1TreatmentFieldFilter: FieldFilterModel<string>;
  public readonly cellType1DiseaseFieldFilter: FieldFilterModel<string>;
  public readonly cellTypeAndSubtype1FieldFilter: FieldFilterCellTypeModel;
  public readonly cellTypeAndSubtype2FieldFilter: FieldFilterCellTypeModel;
  public readonly diseaseFieldFilter: FieldFilterModel<string>;
  public readonly organismFieldFilter: FieldFilterModel<string>;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel<string>;
  public readonly pubMedIdFieldFilter: FieldFilterModel<string>;
  public readonly experimentalDesignFilter: FieldFilterModel<string>;
  public readonly interactionTypeFilter: FieldFilterModel<string>;
  public readonly minDrugDssFilter: FormControl;
  public readonly minTauFilter: FormControl;
  public readonly maxUpFdrFilter: FormControl;
  public readonly maxDownFdrFilter: FormControl;

  private readonly fieldFilters: FieldFilterModel<any>[];

  @ViewChild('cellType1EffectBasic', {static: true}) private cellType1EffectBasicComponent: FilterFieldComponent<string>;
  @ViewChild('cellType1EffectAdvanced', {static: true}) private cellType1EffectAdvancedComponent: FilterFieldComponent<string>;
  @ViewChild('cellType1Treatment', {static: true}) private cellType1TreatmentComponent: FilterFieldComponent<string>;
  @ViewChild('cellType1Disease', {static: true}) private cellType1DiseaseComponent: FilterFieldComponent<string>;
  @ViewChild('cellTypeAndSubtype2', {static: true}) private cellTypeAndSubType2Component: FilterFieldComponent<string>;
  @ViewChild('minDrugDss', {static: true}) minDrugDssFilterComponent: NumberFieldComponent;
  @ViewChild('tauMin', {static: true}) minTauFilterComponent: NumberFieldComponent;
  @ViewChild('maxUpFdr', {static: true}) maxUpFdrFilterComponent: NumberFieldComponent;
  @ViewChild('maxDownFdr', {static: true}) maxDownFdrFilterComponent: NumberFieldComponent;

  @Input()
  public loading = true;

  @Output() public readonly applyDatabaseFilters: EventEmitter<DatabaseQueryParams>;
  @Output() public readonly invalidDatabaseFilters: EventEmitter<boolean>;

  constructor(private service: InteractionsService) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.drugCommonNameFieldFilter = new FieldFilterModel(
      () => this.service.listDrugCommonNameValues(this.createQueryParameters('drugCommonName'))
    );
    this.drugMoaFieldFilter = new FieldFilterModel(
      () => this.service.listDrugMoaValues(this.createQueryParameters('drugMoa'))
    );
    this.drugStatusFieldFilter = new FieldFilterModel(
      () => this.service.listDrugStatusValues(this.createQueryParameters('drugStatus'))
    );
    this.signatureNameFieldFilter = new FieldFilterModel(
      () => this.service.listSignatureNameValues(this.createQueryParameters('signatureName'))
    );
    this.cellType1EffectFieldFilter = new FieldFilterModel(
      Object.keys(DrugEffect)
    );
    this.cellType1TreatmentFieldFilter = new FieldFilterModel(
      () => this.service.listCellType1TreatmentValues(this.createQueryParameters('cellType1Treatment'))
    );
    this.cellType1DiseaseFieldFilter = new FieldFilterModel(
      () => this.service.listCellType1DiseaseValues(this.createQueryParameters('cellType1Disease'))
    );
    this.cellTypeAndSubtype1FieldFilter = new FieldFilterCellTypeModel(
      () => this.service.listCellTypeAndSubtype1Values(this.createQueryParameters(['cellTypeOrSubType1', 'cellType1', 'cellSubType1']))
    );
    this.cellTypeAndSubtype2FieldFilter = new FieldFilterCellTypeModel(
      () => this.service.listCellTypeAndSubtype2Values(this.createQueryParameters(['cellTypeOrSubType2', 'cellType2', 'cellSubType2']))
    );
    this.diseaseFieldFilter = new FieldFilterModel(
      () => this.service.listDiseaseValues(this.createQueryParameters('disease'))
    );
    this.organismFieldFilter = new FieldFilterModel(
      () => this.service.listOrganismValues(this.createQueryParameters('organism'))
    );
    this.signatureSourceDbFieldFilter = new FieldFilterModel(
      () => this.service.listSignatureSourceDbValues(this.createQueryParameters('signatureSourceDb'))
    );
    this.pubMedIdFieldFilter = new FieldFilterModel(
      () => this.service.listSignaturePubMedIdValues(this.createQueryParameters('signaturePubMedId'))
    );
    this.experimentalDesignFilter = new FieldFilterModel(
      () => this.service.listExperimentalDesignValues(this.createQueryParameters('experimentalDesign'))
    );
    this.interactionTypeFilter = new FieldFilterModel(
      () => this.service.listInteractionTypeValues(this.createQueryParameters('interactionType'))
    );

    this.fieldFilters = [
      this.drugCommonNameFieldFilter,
      this.drugMoaFieldFilter,
      this.drugStatusFieldFilter,
      this.signatureNameFieldFilter,
      this.cellType1EffectFieldFilter,
      this.cellType1TreatmentFieldFilter,
      this.cellType1DiseaseFieldFilter,
      this.cellTypeAndSubtype1FieldFilter,
      this.cellTypeAndSubtype2FieldFilter,
      this.diseaseFieldFilter,
      this.organismFieldFilter,
      this.signatureSourceDbFieldFilter,
      this.pubMedIdFieldFilter,
      this.experimentalDesignFilter,
      this.interactionTypeFilter
    ];

    this.minDrugDssFilter = new FormControl();
    this.minTauFilter = new FormControl();
    this.maxUpFdrFilter = new FormControl();
    this.maxDownFdrFilter = new FormControl();

    this.applyDatabaseFilters = new EventEmitter<DatabaseQueryParams>();
    this.invalidDatabaseFilters = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.watchForChanges(this.minDrugDssFilter);
    this.watchForChanges(this.minTauFilter);
    this.watchForChanges(this.maxUpFdrFilter);
    this.watchForChanges(this.maxDownFdrFilter);
  }

  private watchForChanges(field: FormControl): void {
    field.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(() => this.onParametersChanged());
  }

  public mapDrugEffectValues(value: string): string {
    return DrugEffect[value];
  }

  public mapDrugStatus(status: string): string {
    return formatTitle(status);
  }

  public mapInteractionType(interactionType: string): string {
    return formatTitle(interactionType);
  }

  public mapExperimentalDesign(experimentalDesign: string): string {
    return formatTitle(experimentalDesign);
  }

  private emitDatabaseFiltersEvent(queryParams: DatabaseQueryParams): void {
    if (DatabaseQueryParams.hasModifiers(queryParams)) {
      this.applyDatabaseFilters.emit(queryParams);
    } else {
      this.invalidDatabaseFilters.emit(true);
    }
  }

  private createQueryParameters(ignore?: string | string[]): DatabaseQueryParams {
    const params = this.isAdvancedPanelOpened
      ? this.createFullQueryParameters() : this.createBasicQueryParameters();

    if (Boolean(ignore)) {
      const fieldsToIgnore = Array.isArray(ignore) ? ignore : [ignore];

      fieldsToIgnore
        .filter(field => Boolean(params[field]))
        .forEach(field => delete params[field]);
    }

    return params;
  }

  private createFullQueryParameters(): DatabaseQueryParams {
    const experimentalDesign = this.experimentalDesignFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFilter.getClearedFilter()]
      : undefined;

    const interactionType = this.interactionTypeFilter.hasValue()
      ? InteractionType[this.interactionTypeFilter.getClearedFilter()]
      : undefined;

    return {
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      drugMoa: this.drugMoaFieldFilter.getClearedFilter(),
      drugStatus: this.drugStatusFieldFilter.getClearedFilter(),
      minDrugDss: this.minDrugDssFilter.value ? this.minDrugDssFilter.value : undefined,
      signatureName: this.signatureNameFieldFilter.getClearedFilter(),
      cellType1Effect: this.cellType1EffectFieldFilter.getClearedFilter(),
      cellType1Disease: this.cellType1DiseaseFieldFilter.getClearedFilter(),
      cellType1Treatment: this.cellType1TreatmentFieldFilter.getClearedFilter(),
      disease: this.diseaseFieldFilter.getClearedFilter(),
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      signaturePubMedId: this.pubMedIdFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      interactionType: interactionType,
      minTau: this.minTauFilter.value ? this.minTauFilter.value : undefined,
      maxUpFdr: this.maxUpFdrFilter.value ? this.maxUpFdrFilter.value : undefined,
      maxDownFdr: this.maxDownFdrFilter.value ? this.maxDownFdrFilter.value : undefined,
      ...this.getCellTypeFilters()
    };
  }

  private createBasicQueryParameters(): DatabaseQueryParams {
    return {
      drugCommonName: this.drugCommonNameFieldFilter.getClearedFilter(),
      drugMoa: undefined,
      minDrugDss: null,
      signatureName: undefined,
      cellType1Effect: this.cellType1EffectFieldFilter.getClearedFilter(),
      cellType1Disease: undefined,
      cellType1Treatment: undefined,
      disease: undefined,
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: undefined,
      signaturePubMedId: undefined,
      experimentalDesign: undefined,
      interactionType: undefined,
      minTau: null,
      maxUpFdr: null,
      maxDownFdr: null,
      ...this.getCellTypeFilters()
    };
  }

  private getCellTypeFilters(): {
    cellTypeOrSubType1?: string,
    cellType1?: string,
    cellSubType1?: string,
    cellTypeOrSubType2?: string,
    cellType2?: string,
    cellSubType2?: string
  } {
    let cellType1Filters = {};
    let cellType2Filters = {};

    if (this.cellTypeAndSubtype1FieldFilter.hasValue()) {
      if (this.cellTypeAndSubtype1FieldFilter.isOr()) {
        cellType1Filters = {
          cellTypeOrSubType1: this.cellTypeAndSubtype1FieldFilter.getCellTypeOrSubTypeFilter()
        };
      } else {
        cellType1Filters = {
          cellType1: this.cellTypeAndSubtype1FieldFilter.getCellTypeFilter(),
          cellSubType1: this.cellTypeAndSubtype1FieldFilter.getCellSubTypeFilter()
        };
      }

      if (this.cellTypeAndSubtype2FieldFilter.hasValue()) {
        if (this.cellTypeAndSubtype2FieldFilter.isOr()) {
          cellType2Filters = {
            cellTypeOrSubType2: this.cellTypeAndSubtype2FieldFilter.getCellTypeOrSubTypeFilter()
          };
        } else {
          cellType2Filters = {
            cellType2: this.cellTypeAndSubtype2FieldFilter.getCellTypeFilter(),
            cellSubType2: this.cellTypeAndSubtype2FieldFilter.getCellSubTypeFilter(),
          };
        }
      }
    }

    return {
      ...cellType1Filters,
      ...cellType2Filters
    };
  }

  public clearFiltersAction(): void {
    this.drugCommonNameFieldFilter.filter = '';
    this.drugMoaFieldFilter.filter = '';
    this.drugStatusFieldFilter.filter = '';
    this.signatureNameFieldFilter.filter = '';
    this.cellTypeAndSubtype1FieldFilter.filter = '';
    this.cellTypeAndSubtype2FieldFilter.filter = '';
    this.cellType1EffectFieldFilter.filter = '';
    this.cellType1DiseaseFieldFilter.filter = '';
    this.cellType1TreatmentFieldFilter.filter = '';
    this.diseaseFieldFilter.filter = '';
    this.organismFieldFilter.filter = '';
    this.signatureSourceDbFieldFilter.filter = '';
    this.pubMedIdFieldFilter.filter = '';
    this.experimentalDesignFilter.filter = '';
    this.interactionTypeFilter.filter = '';

    this.minDrugDssFilterComponent.clearValue();
    this.minTauFilterComponent.clearValue();
    this.maxUpFdrFilterComponent.clearValue();
    this.maxDownFdrFilterComponent.clearValue();

    this.isAdvancedPanelOpened = false;
  }

  public setFilters(params: ParamMap): void {
    let openAdvancedPanel = false;

    const signatureName = params.get('signatureName');
    if (signatureName) {
      openAdvancedPanel = true;
      this.signatureNameFieldFilter.filter = signatureName;
    }

    const cellType1 = params.get('cellType1');
    const cellTypeOrSubType1 = params.get('cellTypeOrSubType1');
    if (cellType1 || cellTypeOrSubType1) {
      if (cellTypeOrSubType1) {
        this.cellTypeAndSubtype1FieldFilter.setCellTypeAndSubType(cellTypeOrSubType1, undefined);
      } else {
        this.cellTypeAndSubtype1FieldFilter.setCellTypeAndSubType(cellType1, params.get('cellSubType1'));
      }

      const cellType1Effect = params.get('cellType1Effect');
      if (cellType1Effect) {
        this.cellType1EffectFieldFilter.filter = cellType1Effect;
      }

      const cellType1Disease = params.get('cellType1Disease');
      if (cellType1Disease) {
        openAdvancedPanel = true;
        this.cellType1DiseaseFieldFilter.filter = cellType1Disease;
      }

      const cellType1Treatment = params.get('cellType1Treatment');
      if (cellType1Treatment) {
        openAdvancedPanel = true;
        this.cellType1TreatmentFieldFilter.filter = cellType1Treatment;
      }

      const cellTypeOrSubType2 = params.get('cellTypeOrSubType2');
      if (cellTypeOrSubType2) {
        openAdvancedPanel = true;
        this.cellTypeAndSubtype2FieldFilter.setCellTypeAndSubType(cellTypeOrSubType2, undefined);
      } else {
        const cellType2 = params.get('cellType2');
        if (cellType2) {
          openAdvancedPanel = true;
          this.cellTypeAndSubtype2FieldFilter.setCellTypeAndSubType(cellType2, params.get('cellSubType2'));
        }
      }
    }

    const experimentalDesign = params.get('experimentalDesign');
    if (experimentalDesign) {
      openAdvancedPanel = true;
      this.experimentalDesignFilter.filter = experimentalDesign;
    }

    const disease = params.get('disease');
    if (disease) {
      openAdvancedPanel = true;
      this.diseaseFieldFilter.filter = disease;
    }

    const organism = params.get('organism');
    if (organism) {
      this.organismFieldFilter.filter = organism;
    }

    const signaturePubMedId = params.get('signaturePubMedId');
    if (signaturePubMedId) {
      openAdvancedPanel = true;
      this.pubMedIdFieldFilter.filter = signaturePubMedId;
    }

    const drugCommonName = params.get('drugCommonName');
    if (drugCommonName) {
      openAdvancedPanel = true;
      this.drugCommonNameFieldFilter.filter = drugCommonName;
    }

    const drugMoa = params.get('drugMoa');
    if (drugMoa) {
      openAdvancedPanel = true;
      this.drugMoaFieldFilter.filter = drugMoa;
    }

    const drugStatus = params.get('drugStatus');
    if (drugStatus) {
      openAdvancedPanel = true;
      this.drugStatusFieldFilter.filter = drugStatus;
    }

    const minDrugDss = params.get('minDrugDss');
    if (minDrugDss) {
      openAdvancedPanel = true;
      this.minDrugDssFilterComponent.setValue(minDrugDss);
      this.minDrugDssFilter.setValue(minDrugDss);
    }

    const signatureSourceDb = params.get('signatureSourceDb');
    if (signatureSourceDb) {
      openAdvancedPanel = true;
      this.signatureSourceDbFieldFilter.filter = signatureSourceDb;
    }

    const interactionType = params.get('interactionType');
    if (interactionType) {
      openAdvancedPanel = true;
      this.interactionTypeFilter.filter = interactionType;
    }

    const minTau = params.get('minTau');
    if (minTau) {
      openAdvancedPanel = true;
      this.minTauFilterComponent.setValue(minTau);
      this.minTauFilter.setValue(minTau);
    }

    const maxUpFdr = params.get('maxUpFdr');
    if (maxUpFdr) {
      openAdvancedPanel = true;
      this.maxUpFdrFilterComponent.setValue(maxUpFdr);
      this.maxUpFdrFilter.setValue(maxUpFdr);
    }

    const maxDownFdr = params.get('maxDownFdr');
    if (maxDownFdr) {
      openAdvancedPanel = true;
      this.maxDownFdrFilterComponent.setValue(maxDownFdr);
      this.maxDownFdrFilter.setValue(maxDownFdr);
    }

    this.isAdvancedPanelOpened = openAdvancedPanel;

    // this.checkCellType1EffectFilterStatus();
    this.emitDatabaseFiltersEvent(this.createQueryParameters());
  }

  public isFiltersWarningMessageHidden(): boolean {
    return this.drugCommonNameFieldFilter.getClearedFilter() !== undefined ||
      this.cellTypeAndSubtype1FieldFilter.getClearedFilter() !== undefined;
  }

  public getCellType1DependentTooltip(tooltip: string): string {
    if (this.cellTypeAndSubtype1FieldFilter.getClearedFilter()) {
      return tooltip;
    } else {
      return tooltip + '\n\n' + this.TOOLTIP_WARNING_CELL_TYPE_1;
    }
  }

  public onAdvancedPanelOpened(): void {
    this.isAdvancedPanelOpened = true;
  }

  public onAdvancedPanelClosed(): void {
    this.isAdvancedPanelOpened = false;
  }

  public onParametersChanged(fieldFilter?: FieldFilterModel<any>): void {
    for (const filter of this.fieldFilters) {
      if (filter !== fieldFilter) {
        filter.reset(false);
      }
    }

    this.emitDatabaseFiltersEvent(this.createQueryParameters());
  }

  public onCellTypeAndSubtype1Change(): void {
    this.cellTypeAndSubtype2FieldFilter.filter = '';
    this.cellType1DiseaseFieldFilter.filter = '';
    this.cellType1TreatmentFieldFilter.filter = '';

    if (!this.cellTypeAndSubtype1FieldFilter.hasValue()) {
      this.cellType1EffectFieldFilter.filter = '';
    }
    this.onParametersChanged(this.cellTypeAndSubtype1FieldFilter);
  }

  public hasCellTypeAndSubtype1Value(): boolean {
    return this.cellTypeAndSubtype1FieldFilter.hasValue();
  }
}
