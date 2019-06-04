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

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CmapCalculateInteractionsQueryParams} from '../../../../models/interactions/cmap/cmap-calculate-interactions-query-params.model';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {UpDownGenes} from '../../../../models/interactions/up-down-gene-set.model';
import {GeneSet} from '../../../../models/interactions/gene-set.model';
import {CalculateInteractionsQueryParamsModel} from '../../../../models/interactions/calculate-interactions-query.params.model';
import {QueryService} from '../../services/query.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-cmap-query-panel',
  templateUrl: './cmap-query-panel.component.html',
  styleUrls: ['./cmap-query-panel.component.scss']
})
export class CmapQueryPanelComponent implements OnInit {
  private static readonly DEFAULT_VALUES = {
    debounceTime: 500,
    numPerm: 1000,
  };

  public queryTitle: string;
  private numPerm: number;
  private upGenes: string[];
  private downGenes: string[];

  public readonly debounceTime: number;

  public readonly formGroup: FormGroup;

  public constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private interactionsService: QueryService
  ) {
    this.debounceTime = CmapQueryPanelComponent.DEFAULT_VALUES.debounceTime;

    this.queryTitle = '';
    this.upGenes = [];
    this.downGenes = [];

    this.formGroup = this.formBuilder.group({
      'numPerm': [
        CmapQueryPanelComponent.DEFAULT_VALUES.numPerm,
        [Validators.required, Validators.min(1), Validators.max(1000)]
      ]
    });
  }

  private static cleanAndFilterGenes(genes: string): string[] {
    return genes.split(/\s+/)
      .map(gene => gene.trim())
      .filter(gene => gene.length > 0);
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public onDownUpGenesChanged(genes: string): void {
    this.downGenes = CmapQueryPanelComponent.cleanAndFilterGenes(genes);
  }

  public ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(val => {
        if (this.formGroup.valid) {
          this.changeFormConfiguration(val);
        } else {
          this.changeFormConfiguration();
        }
      });

    this.changeFormConfiguration(this.formGroup.value);
  }

  private changeFormConfiguration(val?: {
    numPerm: number;
  }) {
    if (val !== undefined) {
      this.numPerm = val.numPerm;
    } else {
      this.numPerm = undefined;
    }
  }

  public isValid(): boolean {
    return this.upGenes.length > 0 && this.numPerm !== undefined;
  }

  private getQueryConfiguration(): CmapCalculateInteractionsQueryParams {
    return {
      queryTitle: this.queryTitle,
      numPerm: this.numPerm
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
}
