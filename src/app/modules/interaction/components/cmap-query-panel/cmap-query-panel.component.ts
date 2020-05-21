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

import {Component, ViewChild} from '@angular/core';
import {CmapCalculateInteractionsQueryParams} from '../../../../models/interactions/cmap/cmap-calculate-interactions-query-params.model';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {QueryService} from '../../services/query.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PrecalculatedExampleService} from '../../services/precalculated-example.service';
import {PrecalculatedExample} from '../../../../models/interactions/precalculated-example.model';
import {Work} from '../../../../models/work/work.model';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {NumberFieldComponent} from '../../../shared/components/number-field/number-field.component';
import {QueryCaseReferenceTypesComponent} from '../query-case-reference-types/query-case-reference-types.component';

@Component({
  selector: 'app-cmap-query-panel',
  templateUrl: './cmap-query-panel.component.html',
  styleUrls: ['./cmap-query-panel.component.scss']
})
export class CmapQueryPanelComponent {
  private static readonly DEFAULT_VALUES = {
    debounceTime: 500
  };

  public queryTitle: string;
  private caseType: string;
  private referenceType: string;
  private queryType: InteractionType;
  private upGenes: string[];
  private downGenes: string[];

  public readonly debounceTime: number;

  private precalculatedExamples: PrecalculatedExample[];

  @ViewChild('queryTypesComponent', {static: false}) queryTypesComponent: QueryCaseReferenceTypesComponent;

  public constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interactionsService: QueryService,
    private precalculatedExampleService: PrecalculatedExampleService
  ) {
    this.debounceTime = CmapQueryPanelComponent.DEFAULT_VALUES.debounceTime;

    this.queryTitle = '';
    this.upGenes = [];
    this.downGenes = [];

    this.precalculatedExampleService.listCmapPrecalculatedExamples()
      .subscribe(examples => this.precalculatedExamples = examples);
  }

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public onCaseTypeChanged(caseType: string): void {
    this.caseType = caseType;
  }

  public onReferenceTypeChanged(referenceType: string): void {
    this.referenceType = referenceType;
  }

  public onQueryTypeChanged(queryType: InteractionType): void {
    this.queryType = queryType;
  }

  public onGenesQueryTypeEvent(queryType: InteractionType): void {
    this.queryTypesComponent.updateQueryType(queryType);
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public isUpGenesInputEnabled(): boolean {
    return this.queryType !== InteractionType.SIGNATURE_DOWN;
  }

  public isDownGenesInputEnabled(): boolean {
    return this.queryType === InteractionType.SIGNATURE_DOWN || this.queryType === InteractionType.SIGNATURE;
  }

  public isValid(): boolean {
    switch (this.queryType) {
      case InteractionType.SIGNATURE:
        return this.upGenes.length > 0 && this.downGenes.length > 0;
      case InteractionType.SIGNATURE_UP:
        return this.upGenes.length > 0;
      case InteractionType.SIGNATURE_DOWN:
        return this.downGenes.length > 0;
      case InteractionType.GENESET:
        return this.upGenes.length > 0;
    }
  }

  private getQueryConfiguration(): CmapCalculateInteractionsQueryParams {
    return {
      queryTitle: this.queryTitle,
      caseType: this.getCaseType(),
      referenceType: this.getReferenceType()
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

    this.interactionsService.launchCmapQuery(queryParams)
      .subscribe(work => {
        this.navigateToWork(work);
      });
  }

  private getCaseType(): string {
    return this.caseType ? this.caseType : 'case type';
  }

  private getReferenceType(): string {
    return this.referenceType ? this.referenceType : (this.queryType === InteractionType.GENESET ? undefined : 'reference type');
  }

  public hasPrecalculatedExamples(): boolean {
    return this.precalculatedExamples !== undefined && this.precalculatedExamples.length > 0;
  }

  private navigateToWork(work: Work): void {
    this.router.navigate(['../calculated', work.id.id], {relativeTo: this.activatedRoute});
  }
}
