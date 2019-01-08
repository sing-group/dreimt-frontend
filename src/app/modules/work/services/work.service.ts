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

import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {Work} from '../../../models/work/work.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {DreimtError} from '../../notification/entities';
import {map, mergeMap} from 'rxjs/operators';

const CACHE_KEY = 'works';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  private workIds: BehaviorSubject<string[]>;

  private static loadUserWorks(): Set<string> {
    const worksAsString = localStorage.getItem(CACHE_KEY) || '[]';

    return new Set<string>(JSON.parse(worksAsString));
  }

  public constructor(
    private http: HttpClient
  ) {
    this.workIds = new BehaviorSubject<string[]>(Array.from(WorkService.loadUserWorks()));
  }

  public getWork(uuid: string): Observable<Work> {
    return this.http.get<Work>(`${environment.dreimtUrl}/work/${uuid}`)
      .pipe(
        DreimtError.throwOnError('Error retrieving work', `Work with UUID ${uuid} could not be retrieved`)
      );
  }

  public listUserWorksData(workUuids: Observable<string[]> | string[] = this.listUserWorks()): Observable<Work[]> {
    if (Array.isArray(workUuids)) {
      workUuids = of(workUuids);
    }

    return workUuids
      .pipe(
        map(uuids => uuids.map(uuid => this.getWork(uuid))),
        mergeMap(works => forkJoin<Work>(...works))
      );
  }

  public addUserWork(uuid: string): void {
    this.manipulateWorks(works => works.add(uuid));
  }

  public removeUserWork(uuid: string): void {
    this.manipulateWorks(works => works.delete(uuid));
  }

  public listUserWorks(): Observable<string[]> {
    return this.workIds.asObservable();
  }

  private manipulateWorks(modify: (work: Set<string>) => {}): void {
    const works = WorkService.loadUserWorks();

    modify(works);

    if (this.areWorksDifferentFromStored(works)) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(Array.from(works)));

      this.workIds.next(Array.from(works));
    }
  }

  private areWorksDifferentFromStored(works: Set<string>): boolean {
    const storedWorks = WorkService.loadUserWorks();

    return works.size !== storedWorks.size
      || !Array.from(works).every(work => storedWorks.has(work));
  }
}
