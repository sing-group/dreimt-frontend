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

import {Component, ViewChild} from '@angular/core';
import {
  JaccardCalculateInteractionsQueryParams
} from '../../../../models/interactions/jaccard/jaccard-calculate-interactions-query-params.model';
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
import {formatTitle} from '../../../../utils/types';

@Component({
  selector: 'app-jaccard-query-panel',
  templateUrl: './jaccard-query-panel.component.html',
  styleUrls: ['./jaccard-query-panel.component.scss']
})
export class JaccardQueryPanelComponent {
  private static readonly DEFAULT_VALUES = {
    debounceTime: 500,
    maxOptions: 100,
    considerOnlyUniverseGenes: false
  };

  public readonly TOOLTIP_WARNING_CELL_TYPE_1 = 'This filter is disabled, the cell type/subtype 1 must be selected to enable it.';
  public readonly TOOLTIP_CELL_TYPE_1 = 'Specify an immune cell type of interest.';
  public readonly TOOLTIP_SIGNATURE_SOURCE_DB = 'Specify a database source of signatures.';
  public readonly TOOLTIP_SIGNATURE_EXPERIMENTAL_DESIGN = 'Specify the experimental design to retrieve the signature ' +
    '(in vitro, in vivo, patient...).';
  public readonly TOOLTIP_SIGNATURE_CELL_TYPE_2 = 'Specify an immune cell type of interest. This filter is used in combination with the ' +
    'cell type/subtype 1 filter. With both filters applied results will display signatures derived from the comparison of the two ' +
    'specific cell types.';
  public readonly TOOLTIP_SIGNATURE_CONDITION = 'Specify a treatment or disease applied to generate the signature.';
  public readonly TOOLTIP_SIGNATURE_ORGANISM = 'Specify the organism source of the immune cells. ';

  public queryTitle: string;
  private upGenes: string[];
  private downGenes: string[];

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly cellTypeAndSubtype1FieldFilter: FieldFilterCellTypeModel;
  public readonly cellTypeAndSubtype2FieldFilter: FieldFilterCellTypeModel;
  public readonly experimentalDesignFieldFilter: FieldFilterModel<string>;

  public readonly organismFieldFilter: FieldFilterModel<string>;
  public readonly diseaseFieldFilter: FieldFilterModel<string>;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel<string>;

  private readonly fieldFilters: FieldFilterModel<any>[];

  public considerOnlyUniverseGenes: boolean;

  private precalculatedExamples: PrecalculatedExample[];
  public signaturesCount: number;

  @ViewChild('cellTypeAndSubtype2', {static: true}) private cellTypeAndSubType2Component: FilterFieldComponent<string>;

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

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

    this.cellTypeAndSubtype1FieldFilter = new FieldFilterCellTypeModel(
      () => this.service.listCellTypeAndSubtype1Values(this.createQueryParameters())
    );
    this.cellTypeAndSubtype2FieldFilter = new FieldFilterCellTypeModel(
      () => this.service.listCellTypeAndSubtype2Values(this.createQueryParameters())
    );
    this.experimentalDesignFieldFilter = new FieldFilterModel<string>(
      () => this.service.listExperimentalDesignValues(this.createQueryParameters())
    );
    this.organismFieldFilter = new FieldFilterModel<string>(
      () => this.service.listOrganismValues(this.createQueryParameters())
    );
    this.diseaseFieldFilter = new FieldFilterModel<string>(
      () => this.service.listDiseaseValues(this.createQueryParameters())
    );
    this.signatureSourceDbFieldFilter = new FieldFilterModel<string>(
      () => this.service.listSignatureSourceDbValues(this.createQueryParameters())
    );

    this.fieldFilters = [
      this.cellTypeAndSubtype1FieldFilter,
      this.cellTypeAndSubtype2FieldFilter,
      this.experimentalDesignFieldFilter,
      this.organismFieldFilter,
      this.diseaseFieldFilter,
      this.signatureSourceDbFieldFilter
    ];

    this.considerOnlyUniverseGenes = JaccardQueryPanelComponent.DEFAULT_VALUES.considerOnlyUniverseGenes;

    this.precalculatedExampleService.listJaccardPrecalculatedExamples()
      .subscribe(examples => this.precalculatedExamples = examples);
    this.updateSignaturesCount();
  }

  private updateSignaturesCount() {
    this.service.countSignatures(this.createQueryParameters()).subscribe(count => this.signaturesCount = count);
  }

  public mapExperimentalDesign(experimentalDesign: string): string {
    return formatTitle(experimentalDesign);
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  private createQueryParameters(): JaccardCalculateInteractionsQueryParams {
    const experimentalDesign = this.experimentalDesignFieldFilter.hasValue()
      ? ExperimentalDesign[this.experimentalDesignFieldFilter.getClearedFilter()]
      : undefined;

    return {
      disease: this.diseaseFieldFilter.getClearedFilter(),
      experimentalDesign: experimentalDesign,
      organism: this.organismFieldFilter.getClearedFilter(),
      signatureSourceDb: this.signatureSourceDbFieldFilter.getClearedFilter(),
      onlyUniverseGenes: this.considerOnlyUniverseGenes,
      ...this.getCellTypeFilters()
    };
  }

  private getCellTypeFilters() {
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

  public getCellType1DependentTooltip(tooltip: string): string {
    if (this.cellTypeAndSubtype1FieldFilter.getClearedFilter()) {
      return tooltip;
    } else {
      return tooltip + '\n\n' + this.TOOLTIP_WARNING_CELL_TYPE_1;
    }
  }

  public onParametersChanged(fieldFilter?: FieldFilterModel<any>): void {
    for (const filter of this.fieldFilters) {
      if (filter !== fieldFilter) {
        filter.reset(false);
      }
    }

    this.updateSignaturesCount();
  }

  public onCellTypeAndSubtype1Change(): void {
    this.cellTypeAndSubtype2FieldFilter.filter = '';
    if (this.cellTypeAndSubtype1FieldFilter.hasValue()) {
      this.cellTypeAndSubType2Component.enable();
    } else {
      this.cellTypeAndSubType2Component.disable();
    }

    this.onParametersChanged(this.cellTypeAndSubtype1FieldFilter);
  }

  public onConsiderOnlyUniverseGenesChange(): void {
    this.updateSignaturesCount();
  }
}
