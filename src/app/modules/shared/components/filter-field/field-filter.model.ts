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

import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export class FieldFilterModel<T> {
  protected readonly loadingChange: BehaviorSubject<boolean>;
  protected readonly optionsChange: BehaviorSubject<T[]>;
  protected readonly _filterChange: BehaviorSubject<string>;

  protected filterValue: string;

  protected isUpdated: boolean;

  public constructor(
    protected readonly dataLoader: (() => Observable<T[]>) | T[],
    protected readonly mappingFunction = (values: T[]) => values.map(value => String(value))
  ) {
    this.filterValue = '';
    this.loadingChange = new BehaviorSubject<boolean>(false);
    this._filterChange = new BehaviorSubject<string>(this.filterValue);

    if (Array.isArray(this.dataLoader)) {
      this.isUpdated = true;
      this.optionsChange = new BehaviorSubject<T[]>(this.dataLoader);
    } else {
      this.isUpdated = false;
      this.optionsChange = new BehaviorSubject<T[]>([]);
    }
  }

  public update(): void {
    if (!this.isUpdated) {
      this.loadingChange.next(true);

      const subscription = (this.dataLoader as () => Observable<T[]>)()
        .subscribe(
          values => {
            this.isUpdated = true;
            this.optionsChange.next(values);
          },
          () => {},
          () => {
            subscription.unsubscribe();
            this.loadingChange.next(false);
          }
        );
    }
  }

  public reset(resetFilter = true): void {
    if (!this.hasFixedValues() && this.isUpdated) {
      this.isUpdated = false;
      this.optionsChange.next([]);
      if (resetFilter) {
        this.filter = '';
      }
    }
  }

  public hasFixedValues(): boolean {
    return Array.isArray(this.dataLoader);
  }

  public get options(): Observable<string[]> {
    return this.optionsChange.asObservable()
      .pipe(
        map(this.mappingFunction)
      );
  }

  public get isLoading(): Observable<boolean> {
    return this.loadingChange.asObservable();
  }

  public get loading(): boolean {
    return this.loadingChange.value;
  }

  public get filter(): string {
    return this.filterValue;
  }

  public set filter(value: string) {
    if (this.filterValue !== value) {
      this.filterValue = value;
      this._filterChange.next(this.filterValue);
    }
  }

  public get filterChange(): Observable<string> {
    return this._filterChange.asObservable();
  }

  public hasValue(): boolean {
    return this.filterValue !== undefined && this.filterValue.trim() !== '';
  }

  public getClearedFilter(): string {
    return this.hasValue() ? this.filterValue : undefined;
  }
}
