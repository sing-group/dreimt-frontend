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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JaccardCalculateInteractionsQueryParams} from '../../../../models/query/jaccard-calculate-interactions-query-params.model';
import {SignaturesService} from '../../services/signatures.service';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';

@Component({
  selector: 'app-jaccard-query-panel',
  templateUrl: './jaccard-query-panel.component.html',
  styleUrls: ['./jaccard-query-panel.component.scss']
})
export class JaccardQueryPanelComponent implements OnInit {
  private static readonly DEFAULT_VALUES = {
    debounceTime: 500,
    maxOptions: 100,
    considerOnlyUniverseGenes: false
  };

  @Input() public readonly debounceTime: number;
  @Input() public readonly maxOptions: number;

  @Output() public readonly configurationChanged: EventEmitter<JaccardCalculateInteractionsQueryParams>;

  public readonly cellTypeAFieldFilter: FieldFilterModel;
  public readonly cellSubTypeAFieldFilter: FieldFilterModel;
  public readonly cellTypeBFieldFilter: FieldFilterModel;
  public readonly cellSubTypeBFieldFilter: FieldFilterModel;
  public readonly experimentalDesignFieldFilter: FieldFilterModel;
  public readonly organismFieldFilter: FieldFilterModel;
  public readonly diseaseFieldFilter: FieldFilterModel;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel;

  private considerOnlyUniverseGenes: boolean;

  constructor(
    private service: SignaturesService
  ) {
    this.debounceTime = JaccardQueryPanelComponent.DEFAULT_VALUES.debounceTime;
    this.maxOptions = JaccardQueryPanelComponent.DEFAULT_VALUES.maxOptions;

    this.configurationChanged = new EventEmitter<JaccardCalculateInteractionsQueryParams>();

    this.cellTypeAFieldFilter = new FieldFilterModel();
    this.cellSubTypeAFieldFilter = new FieldFilterModel();
    this.cellTypeBFieldFilter = new FieldFilterModel();
    this.cellSubTypeBFieldFilter = new FieldFilterModel();
    this.experimentalDesignFieldFilter = new FieldFilterModel();
    this.organismFieldFilter = new FieldFilterModel();
    this.diseaseFieldFilter = new FieldFilterModel();
    this.signatureSourceDbFieldFilter = new FieldFilterModel();

    this.considerOnlyUniverseGenes = JaccardQueryPanelComponent.DEFAULT_VALUES.considerOnlyUniverseGenes;
  }

  public ngOnInit(): void {
    this.updateFieldValues();
  }

  public updateFieldValues(): void {
    const queryParams = this.createQueryParameters();

    this.loadCellTypeAValues(queryParams);
    this.loadCellSubTypeAValues(queryParams);
    this.loadCellTypeBValues(queryParams);
    this.loadCellSubTypeBValues(queryParams);
    this.loadExperimentalDesignValues(queryParams);
    this.loadOrganismValues(queryParams);
    this.loadDiseaseValues(queryParams);
    this.loadSignatureSourceDbValues(queryParams);

    this.configurationChanged.emit(queryParams);
  }

  private loadCellTypeAValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellTypeAValues(queryParams)
      .subscribe(values => this.cellTypeAFieldFilter.update(values));
  }

  private loadCellSubTypeAValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellSubTypeAValues(queryParams)
      .subscribe(values => this.cellSubTypeAFieldFilter.update(values));
  }
  private loadCellTypeBValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellTypeBValues(queryParams)
      .subscribe(values => this.cellTypeBFieldFilter.update(values));
  }

  private loadCellSubTypeBValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellSubTypeBValues(queryParams)
      .subscribe(values => this.cellSubTypeBFieldFilter.update(values));
  }

  private loadDiseaseValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listDiseaseValues(queryParams)
      .subscribe(values => this.diseaseFieldFilter.update(values));
  }

  private loadExperimentalDesignValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listExperimentalDesignValues(queryParams)
      .subscribe(values => this.experimentalDesignFieldFilter.update(values));
  }

  private loadOrganismValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listOrganismValues(queryParams)
      .subscribe(values => this.organismFieldFilter.update(values));
  }

  private loadSignatureSourceDbValues(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listSignatureSourceDbValues(queryParams)
      .subscribe(values => this.signatureSourceDbFieldFilter.update(values));
  }

  private createQueryParameters(): JaccardCalculateInteractionsQueryParams {
    const experimentalDesign = this.experimentalDesignFieldFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFieldFilter.getClearedFilter()]
      : undefined;

    return {
      cellTypeA: this.cellTypeAFieldFilter.getClearedFilter(),
      cellSubTypeA: this.cellSubTypeAFieldFilter.getClearedFilter(),
      cellTypeB: this.cellTypeBFieldFilter.getClearedFilter(),
      cellSubTypeB: this.cellSubTypeBFieldFilter.getClearedFilter(),
      disease: this.diseaseFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      signatureType: null,
      onlyUniverseGenes: this.considerOnlyUniverseGenes
    };
  }
}
