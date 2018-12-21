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

import {Component} from '@angular/core';
import {QueryService} from '../../services/query.service';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {
  JaccardCalculateInteractionsQueryParams
} from '../../../../models/interactions/jaccard/jaccard-calculate-interactions-query-params.model';
import {CmapCalculateInteractionsQueryParams} from '../../../../models/interactions/cmap/cmap-calculate-interactions-query-params.model';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-interactions-query',
  templateUrl: './calculated-interactions-query-panel.component.html',
  styleUrls: ['./calculated-interactions-query-panel.component.scss']
})
export class CalculatedInteractionsQueryPanelComponent {
  private upGenes: string[];
  private downGenes: string[];
  private jaccardConfiguration: JaccardCalculateInteractionsQueryParams;
  private cmapConfiguration: CmapCalculateInteractionsQueryParams;

  private selectedTab: number;

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interactionsService: QueryService
  ) {
    this.selectedTab = 0;
    this.upGenes = [];
    this.downGenes = [];
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = CalculatedInteractionsQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownUpGenesChanged(genes: string): void {
    this.downGenes = CalculatedInteractionsQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onJaccardConfigurationChanged(event): void {
    this.jaccardConfiguration = event;
  }

  public onCmapConfigurationChanged(event): void {
    this.cmapConfiguration = event;
  }

  public isValid(): boolean {
    return this.upGenes.length > 0 && this.getQueryConfiguration() !== undefined;
  }

  public launchQuery(): void {
    let genes: UpDownGenes | GeneSet;
    if (this.downGenes.length === 0) {
      genes = {
        genes: this.upGenes
      };
    } else {
      genes = {
        upGenes: this.upGenes,
        downGenes: this.downGenes
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

  private getQueryConfiguration(): JaccardCalculateInteractionsQueryParams | CmapCalculateInteractionsQueryParams {
    return this.selectedTab === 0 ? this.jaccardConfiguration : this.cmapConfiguration;
  }
}
