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

import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {JaccardResultsDataSource} from './jaccard-results-data-source';
import {JaccardResultsService} from '../../services/jaccard-results.service';
import {MatPaginator, MatSort} from '@angular/material';
import {JaccardOverlapsQueryParams} from '../../../../models/interactions/jaccard/jaccard-overlaps-query-params';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {GeneOverlapField} from '../../../../models/interactions/jaccard/gene-overlap-field.enum';
import {JaccardQueryResultMetadata} from '../../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-jaccard-results-table',
  templateUrl: './jaccard-results-table.component.html',
  styleUrls: ['./jaccard-results-table.component.scss']
})
export class JaccardResultsTableComponent implements OnInit, AfterViewInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  @Input('resultId') resultId: string;
  @Input('jaccardResultMetadata') jaccardResultMetadata: JaccardQueryResultMetadata;

  public readonly columns: string[];
  public readonly dataSource: JaccardResultsDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public readonly maxJaccardFilter: FormControl;
  public readonly maxPvalueFilter: FormControl;
  public readonly maxFdrFilter: FormControl;

  private routeUrl: string;

  constructor(
    private service: JaccardResultsService
  ) {
    this.routeUrl = window.location.href;

    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new JaccardResultsDataSource(this.service);
    this.columns = [
      'jaccard', 'pValue', 'fdr', 'sourceComparisonType', 'targetComparisonType', 'targetSignature'
    ];

    this.maxJaccardFilter = new FormControl();
    this.maxPvalueFilter = new FormControl();
    this.maxFdrFilter = new FormControl();
  }

  public ngOnInit(): void {
    this.updateResults();
    this.watchForChanges(this.maxJaccardFilter);
    this.watchForChanges(this.maxPvalueFilter);
    this.watchForChanges(this.maxFdrFilter);
  }

  private watchForChanges(field: FormControl): void {
    field.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(() => this.updateResults());
  }


  private resetPage(): void {
    this.paginator.pageIndex = 0;
  }

  private updatePage(queryParams = this.createQueryParameters()): void {
    this.dataSource.list(this.resultId, queryParams);
    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
  }

  public updateResults(): void {
    this.resetPage();

    const queryParams = this.createQueryParameters();

    this.updatePage(queryParams);
  }

  public ngAfterViewInit(): void {
    this.sort.sortChange.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => {
      this.resetPage();
      this.updatePage();
    });

    this.paginator.page.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => this.updatePage());
  }

  private sortDirection(): SortDirection {
    switch (this.sort.direction) {
      case 'asc':
        return SortDirection.ASCENDING;
      case 'desc':
        return SortDirection.DESCENDING;
      default:
        return undefined;
    }
  }

  private orderField(): GeneOverlapField {
    if (this.sortDirection() !== undefined) {
      return GeneOverlapField[this.sort.active];
    } else {
      return undefined;
    }
  }

  private createQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): JaccardOverlapsQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      maxJaccard: this.maxJaccardFilter.value,
      maxPvalue: this.maxPvalueFilter.value,
      maxFdr: this.maxFdrFilter.value,
    };
  }

  public downloadCsv() {
    this.service.downloadCsv(this.resultId, this.createQueryParameters());
  }

  public isMetadataAvailable(): boolean {
    return this.jaccardResultMetadata !== undefined;
  }

  public getUpGenesLabel(): string {
    if (this.jaccardResultMetadata.downGenesCount === null || this.jaccardResultMetadata.downGenesCount === undefined) {
      return 'geneset';
    } else {
      return 'up';
    }
  }

  public formatQueryParameter(object: Object): string {
    if (object === null || object === undefined) {
      return 'not used';
    } else {
      return object.toString();
    }
  }

  public getResultsUrl(): string {
    return this.routeUrl;
  }
}
