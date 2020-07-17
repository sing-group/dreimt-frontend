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

import {FieldFilterModel} from './field-filter.model';
import {CellTypeAndSubtype} from '../../../../models/cell-type-and-subtype.model';
import {Observable} from 'rxjs';

export class FieldFilterCellTypeModel extends FieldFilterModel<CellTypeAndSubtype> {
  private _isAllowedCellSubtype: boolean;

  public constructor(
    dataLoader: () => Observable<CellTypeAndSubtype[]>
  ) {
    super(
      dataLoader,
      (values: CellTypeAndSubtype[]) => {
        const cellTypes = new Set<string>();
        values.map(cts => cts.type).forEach(val => cellTypes.add(val));
        if (this.isAllowedCellSubtype) {
          values.map(cts => cts.type + ' / ' + cts.subType).forEach(val => cellTypes.add(val));
        }

        return Array.from(cellTypes.values());
      }
    );
    this._isAllowedCellSubtype = true;
  }

  public get isAllowedCellSubtype(): boolean {
    return this._isAllowedCellSubtype;
  }

  public set isAllowedCellSubtype(allowed: boolean) {
    this._isAllowedCellSubtype = allowed;
  }

  public setCellTypeAndSubType(cellType: string, cellSubtype: string) {
    if (!cellSubtype) {
      this.filter = cellType;
    } else {
      this.filter = cellType + ' / ' + cellSubtype;
    }
  }

  public getCellTypeFilter(): string {
    let clearedFilter = super.getClearedFilter();
    if (clearedFilter !== undefined) {
      const index = clearedFilter.indexOf('/');
      if (index > -1) {
        clearedFilter = clearedFilter.substr(0, index).trim();
        if (clearedFilter.length === 0) {
          clearedFilter = undefined;
        }
      } else {
        clearedFilter = clearedFilter.trim();
      }
    }
    return clearedFilter;
  }

  public getCellSubTypeFilter(): string {
    let clearedFilter = super.getClearedFilter();
    if (clearedFilter !== undefined) {
      const index = clearedFilter.indexOf('/');
      if (index > -1) {
        clearedFilter = clearedFilter.substr(index + 1).trim();
        if (clearedFilter.length === 0) {
          clearedFilter = undefined;
        }
      } else {
        clearedFilter = undefined;
      }
    }
    return clearedFilter;
  }

  public isOr(): boolean {
    const clearedFilter = super.getClearedFilter();
    return clearedFilter !== undefined && clearedFilter.indexOf('/') === -1;
  }

  public getCellTypeOrSubTypeFilter(): string {
    return super.getClearedFilter();
  }
}
