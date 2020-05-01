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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Drug} from '../../../../models/drug.model';
import {PaginatedDataSource} from '../../../../models/data-source/paginated-data-source';
import {Subscription} from 'rxjs';

export interface DrugContainer {
  drug: Drug;
}

@Component({
  selector: 'app-cmap-drug-results-summary',
  templateUrl: './cmap-drug-results-summary.component.html',
  styleUrls: ['./cmap-drug-results-summary.component.scss']
})
export class CmapDrugResultsSummaryComponent implements OnInit, OnDestroy {

  @Input() public title = 'Drug Summary';
  @Input() public dataSource: PaginatedDataSource<DrugContainer>;

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;

  public drugStatus: string[];
  public drugMoa: string[];

  constructor() {
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {
        const moa: string[][] = data.map(d => d.drug.moa);
        setTimeout(() => {
          this.drugStatus = data.map(d => d.drug.status);
          this.drugMoa = [].concat(...moa);
        });
      }
    );
  }

  public ngOnDestroy(): void {
    this.dataSourceSubscription.unsubscribe();
    this.dataSourceSubscription = undefined;
    this.loadingSubscription.unsubscribe();
    this.loadingSubscription = undefined;
  }

  public isLoading(): boolean {
    return this.loading;
  }
}
