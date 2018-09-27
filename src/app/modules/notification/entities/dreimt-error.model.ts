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

import {catchError} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/internal/types';
import {throwError} from 'rxjs';

export class DreimtError extends Error {
  public readonly summary: string;
  public readonly detail: string;
  public readonly cause?: Error;

  static throwOnError<T>(summary: string, detail: string): MonoTypeOperatorFunction<T> {
    return catchError(
      (error: Error) => throwError(new DreimtError(summary, detail, error))
    );
  }

  constructor(summary: string, detail: string, cause?: Error) {
    super(detail);

    this.summary = summary;
    this.detail = detail;
    this.cause = cause;

    Object.setPrototypeOf(this, DreimtError.prototype);
  }
}
