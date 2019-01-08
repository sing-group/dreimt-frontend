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
import {WorkService} from '../../services/work.service';
import {Work} from '../../../../models/work/work.model';
import {Subscription, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {isActiveExecution} from '../../../../models/work/execution-status.enum';
import {compareStrings} from '../../../../utils/types';

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {
  public works: Work[];

  private updater: Subscription;

  public constructor(
    private router: Router,
    private workService: WorkService
  ) {
    this.works = [];
    this.updater = null;
  }

  public ngOnInit(): void {
    this.workService.listUserWorks()
      .pipe(
        mergeMap(() => this.workService.listUserWorksData())
      )
      .subscribe(works => this.updateWorks(works));
  }

  public goToWork(uuid: string): void {
    this.router.navigate(['calculated', uuid]);
  }

  private updateWorks(works: Work[], merge: boolean = false): void {
    if (merge) {
      for (const work of works) {
        const currentWork = this.works.find(storedWork => storedWork.id.id === work.id.id);

        if (currentWork !== undefined) {
          Object.assign(currentWork, work);
        } else {
          this.works.push(work);
        }
      }
    } else {
      this.works = works;
    }

    this.works.sort((w1, w2) => compareStrings(w1.id.id, w2.id.id));

    this.checkWorksForUpdate();
  }

  private checkWorksForUpdate(): void {
    const hasActiveWorks = this.works.some(work => isActiveExecution(work.status));

    if (!hasActiveWorks) {
      if (this.updater !== null) {
        this.updater.unsubscribe();
        this.updater = null;
      }
    } else {
      if (this.updater === null) {
        this.updater = timer(0, 5000)
          .pipe(
            mergeMap(() => {
              const activeWorkUuids = this.works
                .filter(work => isActiveExecution(work.status))
                .map(work => work.id.id);

              return this.workService.listUserWorksData(activeWorkUuids);
            })
          )
          .subscribe(works => this.updateWorks(works, true));
      }
    }
  }
}
