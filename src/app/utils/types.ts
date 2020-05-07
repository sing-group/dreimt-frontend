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

export function isArrayOfStrings(object: any): object is string[] {
  return Array.isArray(object) && object.every(item => typeof item === 'string');
}

export function isArrayOf<T>(object: any, checkItem: ((any) => boolean)): object is T[] {
  return Array.isArray(object) && object.every(checkItem);
}

export function toPlainObject(params: object, fieldsToIgnore: string[] = []): {
  [param: string]: string;
} {
  return Object.keys(params).reduce((acc, key) => {
    const value = params[key];

    if (value !== undefined && value !== null && !fieldsToIgnore.includes(key)) {
      acc[key] = String(value);
    }

    return acc;
  }, {});
}

export function compareDates(s1: Date, s2: Date): number {
  if (s1 < s2) { return -1; }
  if (s1 > s2) { return 1; }
  return 0;
}

export function formatTitle(title: string): string {
  return title.charAt(0) + title.slice(1).replace('_', ' ').toLowerCase();
}
