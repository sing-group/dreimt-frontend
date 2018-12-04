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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InteractionsService} from '../../services/interactions.service';
import {DatabaseDataSource} from './database-data-source';
import {MatPaginator} from '@angular/material';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements AfterViewInit, OnInit {
  public readonly columns;
  public readonly dataSource;

  public length;

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  constructor(
    private service: InteractionsService
  ) {
    this.dataSource = new DatabaseDataSource(this.service);
    this.columns = [
      'drug', 'signature', 'tes', 'pValue', 'fdr',
      'signatureType', 'experimentalDesign', 'cellTypeA', 'cellTypeB', 'cellSubtypeA', 'cellSubtypeB',
      'disease', 'organism', 'article', 'signatureSourceDb', 'drugSourceName', 'drugSourceDb'
    ];
  }

  public ngOnInit(): void {
    this.dataSource.count$.subscribe(count => this.length = count);
    this.loadInteractions();
  }

  public ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadInteractions())
    ).subscribe();
  }

  private loadInteractions(defaultPageIndex = 0, defaultPageSize = 10): void {
    this.dataSource.list({
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize
    });
  }
}
