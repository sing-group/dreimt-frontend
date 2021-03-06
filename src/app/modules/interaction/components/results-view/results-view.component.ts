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
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Work} from '../../../../models/work/work.model';
import {ExecutionStatus} from '../../../../models/work/execution-status.enum';
import {JaccardQueryResultMetadata} from '../../../../models/interactions/jaccard/jaccard-query-result-metadata';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
import {WorkService} from '../../../work/services/work.service';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.scss']
})
export class ResultsViewComponent implements OnInit {
  public results: JaccardQueryResultMetadata | CmapQueryUpDownSignatureResultsMetadata | CmapQueryGeneSetSignatureResultsMetadata;

  private uuid: string;
  private work: Work;

  private workSubscription: Subscription;

  public constructor(
    private route: ActivatedRoute,
    private workService: WorkService,
    private queryService: QueryService,
    private router: Router
  ) {
    this.workSubscription = null;
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
    return !this.isLoading() && (this.work.status === ExecutionStatus.COMPLETED || this.work.status === ExecutionStatus.FAILED);
  }

  public isFailed(): boolean {
    return !this.isLoading() && this.work.status === ExecutionStatus.FAILED;
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

  private watchWork(): void {
    if (this.workSubscription !== null) {
      this.workSubscription.unsubscribe();
      this.workSubscription = null;
    }

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
        .subscribe(results => {
          this.updateResults(results);
        });

      if (this.workSubscription !== null) {
        this.workSubscription.unsubscribe();
        this.workSubscription = null;
      }
    }
  }

  private updateResults(results) {
    this.results = results;
    if (CmapQueryUpDownSignatureResultsMetadata.isA(this.results)) {
      this.router.navigate(['/query/drug-prioritization/results/signature/' + this.uuid]);
    } else if (CmapQueryGeneSetSignatureResultsMetadata.isA(this.results)) {
      this.router.navigate(['/query/drug-prioritization/results/geneset/' + this.uuid]);
    } else if (JaccardQueryResultMetadata.isA(this.results)) {
      this.router.navigate(['/query/signatures-comparison/results/' + this.uuid]);
    }
  }
}
