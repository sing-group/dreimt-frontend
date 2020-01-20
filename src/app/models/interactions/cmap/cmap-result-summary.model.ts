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

export interface SummaryElement {
  candidates: string;
  drugStatus: string;
  count: number;
  moaCounts: SummarySubElement[];
}

export interface SummarySubElement {
  moa: string;
  count: number;
}

export interface DrugSummary {
  status: string;
  moa: string;
}

export class SummaryHelper {

  public static mapToSummaryElement(drugSummaryMap: Map<string, string[]>, candidates: string, topMoaValues: number): SummaryElement[] {
    let elements: SummaryElement[] = [];
    drugSummaryMap.forEach((value, key) => {
      const moaFrequencies = SummaryHelper.frequencies(value);

      const moaCounts = Array.from(moaFrequencies.values()).sort(function (a, b) {
        return b - a;
      });

      const moaThreshold = moaCounts[Math.min(moaCounts.length, topMoaValues)];

      let moaSummary: SummarySubElement[] = [];

      moaFrequencies.forEach((moaValue, moaKey) => {
        if (moaValue => moaThreshold) {
          moaSummary = moaSummary.concat(
            [{moa: moaKey, count: moaValue}]
          );
        }
      });

      elements = elements.concat(
        [{
          candidates: candidates,
          drugStatus: key.charAt(0) + key.substring(1).toLowerCase(),
          count: value.length,
          moaCounts: moaSummary
        }]);
    });

    return elements;
  }


  public static mapDrugSummaryArray(drugSummaryElements: DrugSummary[]): Map<string, string[]> {
    const map = new Map();

    drugSummaryElements.forEach(drugSummary => {
      if (!map.has(drugSummary.status)) {
        map.set(drugSummary.status, []);
      }
      map.set(drugSummary.status, map.get(drugSummary.status).concat(drugSummary.moa));
    });

    return map;
  }

  private static frequencies(list: string[]): Map<string, number> {
    const frequencies = new Map();
    list.forEach(element => {
      if (!frequencies.has(element)) {
        frequencies.set(element, 0);
      }
      frequencies.set(element, frequencies.get(element) + 1);
    });

    return frequencies;
  }
}
