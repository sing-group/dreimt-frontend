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

import {BehaviorSubject, Observable} from 'rxjs';

export class FieldFilterModel {
  private readonly optionsSubject: BehaviorSubject<string[]>;
  private filterValue: string;

  public constructor() {
    this.filterValue = '';
    this.optionsSubject = new BehaviorSubject<string[]>([]);
  }

  public update(values: string[]): void {
    if (!this.areArraysEqual(this.optionsSubject.value, values)) {
      this.optionsSubject.next(values);
    }
  }

  private areArraysEqual(a1: string[], a2: string[]): boolean {
    return a1.every(value => a2.includes(value)) && a2.every(value => a1.includes(value));
  }

  public get options(): Observable<string[]> {
    return this.optionsSubject.asObservable();
  }

  public get filter() {
    return this.filterValue;
  }

  public set filter(value: string) {
    this.filterValue = value;
  }

  public hasValue(): boolean {
    return this.filterValue !== undefined && this.filterValue.trim() !== '';
  }

  public getClearedFilter(): string {
    return this.hasValue() ? this.filterValue : undefined;
  }
}
