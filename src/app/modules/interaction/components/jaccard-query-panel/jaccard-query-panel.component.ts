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

import {Component, OnInit, ViewChild} from '@angular/core';
import {JaccardCalculateInteractionsQueryParams} from '../../../../models/interactions/jaccard/jaccard-calculate-interactions-query-params.model';
import {SignaturesService} from '../../services/signatures.service';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryService} from '../../services/query.service';
import {PrecalculatedExampleService} from '../../services/precalculated-example.service';
import {PrecalculatedExample} from '../../../../models/interactions/precalculated-example.model';
import {Work} from '../../../../models/work/work.model';
import {FilterFieldComponent} from '../../../shared/components/filter-field/filter-field.component';
import {FieldFilterCellTypeModel} from '../../../shared/components/filter-field/field-filter-cell-type.model';

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

  public queryTitle: string;
  private upGenes: string[];
  private downGenes: string[];

  private previousQueryParams: JaccardCalculateInteractionsQueryParams;

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly cellTypeAndSubtype1FieldFilter: FieldFilterCellTypeModel;
  public readonly cellTypeAndSubtype2FieldFilter: FieldFilterCellTypeModel;

  public readonly experimentalDesignFieldFilter: FieldFilterModel;
  public readonly organismFieldFilter: FieldFilterModel;
  public readonly diseaseFieldFilter: FieldFilterModel;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel;

  public considerOnlyUniverseGenes: boolean;

  private precalculatedExamples: PrecalculatedExample[];

  @ViewChild('cellTypeAndSubtype2', {static: true}) private cellTypeAndSubType2Component: FilterFieldComponent;

  constructor(
    private service: SignaturesService,
    private precalculatedExampleService: PrecalculatedExampleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interactionsService: QueryService
  ) {
    this.debounceTime = JaccardQueryPanelComponent.DEFAULT_VALUES.debounceTime;
    this.maxOptions = JaccardQueryPanelComponent.DEFAULT_VALUES.maxOptions;

    this.queryTitle = '';
    this.upGenes = [];
    this.downGenes = [];

    this.cellTypeAndSubtype1FieldFilter = new FieldFilterCellTypeModel();
    this.cellTypeAndSubtype2FieldFilter = new FieldFilterCellTypeModel();
    this.experimentalDesignFieldFilter = new FieldFilterModel();
    this.organismFieldFilter = new FieldFilterModel();
    this.diseaseFieldFilter = new FieldFilterModel();
    this.signatureSourceDbFieldFilter = new FieldFilterModel();

    this.considerOnlyUniverseGenes = JaccardQueryPanelComponent.DEFAULT_VALUES.considerOnlyUniverseGenes;

    this.precalculatedExampleService.listJaccardPrecalculatedExamples()
      .subscribe(examples => this.precalculatedExamples = examples);
  }

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public ngOnInit(): void {
    this.updateFieldValues();
  }

  public updateFieldValues(): void {
    this.checkCellTypeAndSubType2FiltersStatus();

    const queryParams = this.createQueryParameters();

    if (!JaccardCalculateInteractionsQueryParams.equals(queryParams, this.previousQueryParams)) {
      this.loadCellTypeAndSubtype1Values(queryParams);
      this.loadExperimentalDesignValues(queryParams);
      this.loadOrganismValues(queryParams);
      this.loadDiseaseValues(queryParams);
      this.loadSignatureSourceDbValues(queryParams);

      if (this.cellTypeAndSubtype1FieldFilter.getClearedFilter()) {
        this.loadCellTypeAndSubtype2Values(queryParams);
      }

      this.previousQueryParams = queryParams;
    }
  }

  private checkCellTypeAndSubType2FiltersStatus(): void {
    if (this.cellTypeAndSubtype1FieldFilter.getClearedFilter()) {
      this.cellTypeAndSubType2Component.enable();
    } else {
      this.cellTypeAndSubtype2FieldFilter.filter = '';
      this.cellTypeAndSubType2Component.disable();
    }
  }

  private loadCellTypeAndSubtype1Values(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellTypeAndSubtype1Values(queryParams)
      .subscribe(values => this.cellTypeAndSubtype1FieldFilter.updateCellTypeAndSubtypeValues(values, true));
  }

  private loadCellTypeAndSubtype2Values(queryParams: JaccardCalculateInteractionsQueryParams): void {
    this.service.listCellTypeAndSubtype2Values(queryParams)
      .subscribe(values => this.cellTypeAndSubtype2FieldFilter.updateCellTypeAndSubtypeValues(values, this.isAllowedCellSubtype2()));
  }

  private isAllowedCellSubtype2(): boolean {
    return this.cellTypeAndSubtype1FieldFilter.getCellSubtypeFilter() !== undefined;
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
  }ff

  private createQueryParameters(): JaccardCalculateInteractionsQueryParams {
    const experimentalDesign = this.experimentalDesignFieldFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFieldFilter.getClearedFilter()]
      : undefined;

    return {
      cellType1: this.cellTypeAndSubtype1FieldFilter.getCellTypeFilter(),
      cellSubType1: this.cellTypeAndSubtype1FieldFilter.getCellSubtypeFilter(),
      cellType2: this.cellTypeAndSubtype2FieldFilter.getCellTypeFilter(),
      cellSubType2: this.cellTypeAndSubtype2FieldFilter.getCellSubtypeFilter(),
      disease: this.diseaseFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      onlyUniverseGenes: this.considerOnlyUniverseGenes
    };
  }

  public isValid(): boolean {
    return (this.upGenes.length > 0 || this.downGenes.length > 0) && this.getQueryConfiguration() !== undefined;
  }

  private getQueryConfiguration(): JaccardCalculateInteractionsQueryParams {
    return {
      queryTitle: this.queryTitle,
      ...this.createQueryParameters()
    };
  }

  public launchQuery(): void {
    const genes: UpDownGenes = {
      up: this.upGenes,
      down: this.downGenes
    };

    const queryParams: CalculateInteractionsQueryParamsModel = {
      params: this.getQueryConfiguration(),
      genes: genes
    };

    this.interactionsService.launchJaccardQuery(queryParams)
      .subscribe(work => {
        this.navigateToWork(work);
      });
  }

  public hasPrecalculatedExamples(): boolean {
    return this.precalculatedExamples !== undefined && this.precalculatedExamples.length > 0;
  }

  private navigateToWork(work: Work): void {
    this.router.navigate(['../calculated', work.id.id], {relativeTo: this.activatedRoute});
  }
}
