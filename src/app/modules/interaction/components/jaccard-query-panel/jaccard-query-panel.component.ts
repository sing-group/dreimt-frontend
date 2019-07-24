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
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryService} from '../../services/query.service';
import {Examples} from '../../../../models/examples.model';
import {GeneListComponent} from '../gene-list/gene-list.component';

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

  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly cellTypeAFieldFilter: FieldFilterModel;
  public readonly cellSubTypeAFieldFilter: FieldFilterModel;
  public readonly cellTypeBFieldFilter: FieldFilterModel;
  public readonly cellSubTypeBFieldFilter: FieldFilterModel;
  public readonly experimentalDesignFieldFilter: FieldFilterModel;
  public readonly organismFieldFilter: FieldFilterModel;
  public readonly diseaseFieldFilter: FieldFilterModel;
  public readonly signatureSourceDbFieldFilter: FieldFilterModel;

  public considerOnlyUniverseGenes: boolean;

  @ViewChild('upGenes') private upGenesComponent: GeneListComponent;
  @ViewChild('downGenes') private downGenesComponent: GeneListComponent;

  constructor(
    private service: SignaturesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interactionsService: QueryService
  ) {
    this.debounceTime = JaccardQueryPanelComponent.DEFAULT_VALUES.debounceTime;
    this.maxOptions = JaccardQueryPanelComponent.DEFAULT_VALUES.maxOptions;

    this.queryTitle = '';
    this.upGenes = [];
    this.downGenes = [];

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

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownUpGenesChanged(genes: string): void {
    this.downGenes = JaccardQueryPanelComponent.cleanAndFilterGenes(genes);
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
      onlyUniverseGenes: this.considerOnlyUniverseGenes
    };
  }

  public isValid(): boolean {
    return this.upGenes.length > 0 && this.getQueryConfiguration() !== undefined;
  }

  private getQueryConfiguration(): JaccardCalculateInteractionsQueryParams {
    return {
      queryTitle: this.queryTitle,
      ...this.createQueryParameters()
    };
  }

  public launchQuery(): void {
    let genes: UpDownGenes | GeneSet;
    if (this.downGenes.length === 0) {
      genes = {
        genes: this.upGenes
      };
    } else {
      genes = {
        up: this.upGenes,
        down: this.downGenes
      };
    }

    const queryParams: CalculateInteractionsQueryParamsModel = {
      params: this.getQueryConfiguration(),
      genes: genes
    };

    this.interactionsService.launchQuery(queryParams)
      .subscribe(work => {
        this.router.navigate(['../calculated', work.id.id], {relativeTo: this.activatedRoute});
      });
  }

  public getExampleTitle(index: number): string {
    switch (index) {
      case 1:
        return Examples.EX_1_TITLE;
      case 2:
        return Examples.EX_2_TITLE;
      default:
        return '';
    }
  }

  public loadExample1(): void {
    this.upGenesComponent.updateGenes(Examples.EX_1_UP_GENES);
    this.downGenesComponent.updateGenes(Examples.EX_1_DOWN_GENES);
    this.queryTitle = 'Prediction Query: ' + Examples.EX_1_TITLE;
  }

  public loadExample2(): void {
    this.upGenesComponent.updateGenes(Examples.EX_2_UP_GENES);
    this.downGenesComponent.updateGenes(Examples.EX_2_DOWN_GENES);
    this.queryTitle = 'Prediction Query: ' + Examples.EX_2_TITLE;
  }
}
