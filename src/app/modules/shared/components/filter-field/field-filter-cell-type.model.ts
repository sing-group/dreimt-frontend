/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2020 - Hugo López-Fernández,
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

export class FieldFilterCellTypeModel extends FieldFilterModel {

  public constructor() {
    super();
  }

  public updateCellTypeAndSubtypeValues(values: CellTypeAndSubtype[], isAllowedCellSubtype: boolean): void {
    const cellTypes = new Set();
    values.map(cts => cts.type).forEach(val => cellTypes.add(val));
    if (isAllowedCellSubtype) {
      values.map(cts => cts.type + ' / ' + cts.subType).forEach(val => cellTypes.add(val));
    }
    super.update(Array.from(cellTypes.values()));
  }

  public setCellTypeAndSubtype(cellType: string, cellSubtype: string) {
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

  public getCellSubtypeFilter(): string {
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
}
