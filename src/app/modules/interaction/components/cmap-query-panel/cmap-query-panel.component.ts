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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CmapCalculateInteractionsQueryParams} from '../../../../models/interactions/cmap/cmap-calculate-interactions-query-params.model';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {QueryService} from '../../services/query.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GeneListComponent} from '../gene-list/gene-list.component';
import {PrecalculatedExampleService} from '../../services/precalculated-example.service';
import {PrecalculatedExample} from '../../../../models/interactions/precalculated-example.model';
import {Work} from '../../../../models/work/work.model';

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
  private upGenes: string[];
  private downGenes: string[];

  public readonly debounceTime: number;

  private precalculatedExamples: PrecalculatedExample[];

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

  public onUpGenesChanged(genes: string): void {
    this.upGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public isValid(): boolean {
    return this.upGenes.length > 0 || this.downGenes.length > 0;
  }

  private getQueryConfiguration(): CmapCalculateInteractionsQueryParams {
    return {
      queryTitle: this.queryTitle
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

  public hasPrecalculatedExamples(): boolean {
    return this.precalculatedExamples !== undefined && this.precalculatedExamples.length > 0;
  }

  private navigateToWork(work: Work): void {
    this.router.navigate(['../calculated', work.id.id], {relativeTo: this.activatedRoute});
  }
}
