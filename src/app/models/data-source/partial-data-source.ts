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

import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {catchError, finalize} from 'rxjs/operators';
import {PartialResult} from './partial-result';

export abstract class PartialDataSource<T> extends DataSource<T> {
  private readonly dataSubject: BehaviorSubject<T[]>;
  private readonly countSubject: BehaviorSubject<number>;
  private readonly loadingSubject: BehaviorSubject<boolean>;

  public readonly data$: Observable<T[]>;
  public readonly count$: Observable<number>;
  public readonly loading$: Observable<boolean>;

  protected constructor() {
    super();

    this.dataSubject = new BehaviorSubject([]);
    this.countSubject = new BehaviorSubject(0);
    this.loadingSubject = new BehaviorSubject(false);

    this.data$ = this.dataSubject.asObservable();
    this.count$ = this.countSubject.asObservable();
    this.loading$ = this.loadingSubject.asObservable();
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.countSubject.complete();
    this.loadingSubject.complete();
  }

  public update(newData: Observable<PartialResult<T>>): void {
    this.loadingSubject.next(true);

    newData.pipe(
      catchError(() => of({
        count: 0,
        result: []
      })),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe((partial: PartialResult<T>) => {
      this.dataSubject.next(partial.result);
      this.countSubject.next(partial.count);
    });
  }
}

