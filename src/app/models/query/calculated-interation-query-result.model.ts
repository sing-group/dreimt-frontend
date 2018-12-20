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

export class CalculatedInterationQueryResult {
  public readonly id: number;
  public readonly signatureName: string;
  public readonly studyId: string;
  public readonly source: string;
  public readonly article: string;
  public readonly articleAbstract: string;
  public readonly authors: string;
  public readonly pubMedId: number;
  public readonly signatureInfo: string;
  public readonly organism: string;
  public readonly cellTypeA: string;
  public readonly cellTypeB: string;
  public readonly experimentalDesign: string;
  public readonly tissueType: string;
  public readonly disease: string;
  public readonly drugName: string;
  public readonly drugSystematicName: number;
  public readonly nes: number;
  public readonly pValue: number;
  public readonly fdr: number;
}
