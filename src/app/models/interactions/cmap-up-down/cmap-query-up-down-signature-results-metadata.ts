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

export class CmapQueryUpDownSignatureResultsMetadata {
  private resultId: string;
  public readonly queryTitle: string;
  public readonly numPerm: number;
  public readonly upGenesCount: number;
  public readonly upUniverseGenesCount: number;
  public readonly downGenesCount: number;
  public readonly downUniverseGenesCount: number;

  public set id(id: string) {
    if (this.resultId === undefined) {
      this.resultId = id;
    } else {
      throw Error('id already has a value');
    }
  }

  public get id(): string {
    return this.resultId;
  }

  public static isA(object: any): object is CmapQueryUpDownSignatureResultsMetadata {
    return object !== undefined && object !== null && object.numPerm !== undefined &&
      object.upGenesCount !== undefined && object.upUniverseGenesCount !== undefined &&
      object.downGenesCount !== undefined && object.downUniverseGenesCount !== undefined;
  }
}
