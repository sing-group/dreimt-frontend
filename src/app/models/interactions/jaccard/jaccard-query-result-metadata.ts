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

import {ExperimentalDesign} from '../../experimental-design.enum';

export class JaccardQueryResultMetadata {
  public readonly queryTitle: string;
  public readonly onlyUniverseGenes: boolean;
  public readonly cellTypeA?: string;
  public readonly cellSubTypeA?: string;
  public readonly cellTypeB?: string;
  public readonly cellSubTypeB?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly organism?: string;
  public readonly disease?: string;
  public readonly signatureSourceDb?: string;
  public readonly upGenesCount?: number;
  public readonly upUniverseGenesCount?: number;
  public readonly downGenesCount?: number;
  public readonly downUniverseGenesCount?: number;

  public static isA(object: any): object is JaccardQueryResultMetadata {
    return object !== undefined && object !== null && object.onlyUniverseGenes !== undefined;
  }
}
