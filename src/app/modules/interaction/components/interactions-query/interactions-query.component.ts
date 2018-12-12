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

import {Component, OnInit} from '@angular/core';
import {QueryService} from '../../services/query.service';
import {
  CmapSignatureQueryParams,
  GeneSet,
  JaccardSignatureQueryParams,
  QueryParams,
  UpDownGenes
} from '../../models/signature-query-params.model';

@Component({
  selector: 'app-interactions-query',
  templateUrl: './interactions-query.component.html',
  styleUrls: ['./interactions-query.component.scss']
})
export class InteractionsQueryComponent {
  private selectedTab: number;
  private upGenes: string[];
  private downGenes: string[];
  private jaccardConfiguration: JaccardSignatureQueryParams;
  private cmapConfiguration: CmapSignatureQueryParams;

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public constructor(private interactionsService: QueryService) {
    this.selectedTab = 0;
    this.upGenes = [];
    this.downGenes = [];
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = InteractionsQueryComponent.cleanAndFilterGenes(genes);
  }

  public onDownUpGenesChanged(genes: string): void {
    this.downGenes = InteractionsQueryComponent.cleanAndFilterGenes(genes);
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

    const queryParams: QueryParams = {
      params: this.getQueryConfiguration(),
      genes: genes
    };

    this.interactionsService.launchQuery(queryParams)
      .subscribe(work => console.log(work)); // Forces execution
  }

  private getQueryConfiguration(): JaccardSignatureQueryParams | CmapSignatureQueryParams {
    let configuration: JaccardSignatureQueryParams | CmapSignatureQueryParams;

    if (this.selectedTab === 0) {
      configuration = this.jaccardConfiguration;
    } else {
      configuration = this.cmapConfiguration;
    }

    return configuration;
  }
}
