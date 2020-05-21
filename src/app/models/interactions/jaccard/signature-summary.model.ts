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

import {isArrayOfStrings} from '../../../utils/types';

export class SignatureSummary {
  public readonly signatureName: string;
  public readonly cellTypeA: string[];
  public readonly cellSubTypeA: string[];
  public readonly cellTypeB: string[];
  public readonly cellSubTypeB: string[];
  public readonly signatureGenesUri: string;
  public readonly articleMetadataUri: string;
  public readonly sourceDb: string;
  public readonly sourceDbUrl: string;
  public readonly articlePubMedId: number;
  public readonly articleTitle: string;
  public readonly articleAuthors: string;

  public static isA(object: any): object is SignatureSummary {
    return object !== undefined && object !== null
      && object.signatureName !== undefined
      && isArrayOfStrings(object.cellTypeA)
      && isArrayOfStrings(object.cellSubTypeA)
      && isArrayOfStrings(object.cellTypeB)
      && isArrayOfStrings(object.cellSubTypeB)
      && object.signatureGenesUri !== undefined
      && object.articleMetadataUri !== undefined
      && object.sourceDb !== undefined
      && object.sourceDbUrl !== undefined
      && object.articlePubMedId !== undefined
      && object.articleTitle !== undefined
      && object.articleAuthors !== undefined;
  }
}
