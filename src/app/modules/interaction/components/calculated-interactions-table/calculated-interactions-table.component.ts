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
import {QueryService} from '../../services/query.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Work} from '../../../../models/work/work.model';
import {ExecutionStatus} from '../../../../models/work/execution-status.enum';
import {JaccardQueryResultMetadata} from '../../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {CmapQueryResultsMetadata} from '../../../../models/interactions/cmap/cmap-query-results-metadata';
import {WorkService} from '../../../work/services/work.service';

@Component({
  selector: 'app-drug-cell-interactions-table',
  templateUrl: './calculated-interactions-table.component.html',
  styleUrls: ['./calculated-interactions-table.component.scss']
})
export class CalculatedInteractionsTableComponent implements OnInit {
  public results: JaccardQueryResultMetadata | CmapQueryResultsMetadata;

  public uuid: string;
  public work: Work;

  private workSubscription: Subscription;

  public constructor(
    private route: ActivatedRoute,
    private workService: WorkService,
    private queryService: QueryService
  ) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.watchWork();
    });
  }

  public isLoading(): boolean {
    return this.work === undefined && this.results === undefined;
  }

  public isFinished(): boolean {
    return !this.isLoading() && this.work.status === ExecutionStatus.COMPLETED;
  }

  public currentProgress(): number {
    if (this.work === undefined) {
      return 0;
    } else {
      return 100 * this.work.steps
        .map(step => step.progress)
        .reduce((prev, curr) => Math.max(prev, curr), 0);
    }
  }

  public getResultId(): string {
    return this.work.id.id;
  }

  public isJaccard(): boolean {
    return JaccardQueryResultMetadata.isA(this.results);
  }

  public isCmap(): boolean {
    return CmapQueryResultsMetadata.isA(this.results);
  }

  private watchWork(): void {
    this.workSubscription = timer(0, 2000)
      .pipe(
        mergeMap(() => this.workService.getWork(this.uuid))
      )
      .subscribe(work => this.updateWork(work));
  }

  private updateWork(work: Work): void {
    this.work = work;

    if (work.status === ExecutionStatus.COMPLETED) {
      this.queryService.getWorkResult(work)
        .subscribe(results => this.results = results);

      this.workSubscription.unsubscribe();
      this.workSubscription = null;
    }
  }
}
