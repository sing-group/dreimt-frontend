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

import {SortDirection} from './sort-direction.model';
import {DrugSignatureInteractionField} from './drug-signature-interaction-field.model';

export class DrugSignatureInteractionQueryParams {
  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: DrugSignatureInteractionField;
  public readonly sortDirection?: SortDirection;
  public readonly signatureName?: string;
  public readonly cellTypeA?: string;
  public readonly cellTypeB?: string;
  public readonly cellSubTypeA?: string;
  public readonly cellSubTypeB?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly disease?: string;
  public readonly organism?: string;
  public readonly signaturePubMedId?: string;
  public readonly drugSourceName?: string;
  public readonly drugSourceDb?: string;
  public readonly drugCommonName?: string;
  public readonly signatureSourceDb?: string;
  public readonly signatureType?: SignatureType;
  public readonly maxPvalue?: number;
  public readonly minTes?: number;
  public readonly maxTes?: number;
  public readonly maxFdr?: number;

  public static toPlainObject(params: DrugSignatureInteractionQueryParams): {
    [param: string]: string | string[];
  } {
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = String(params[key]);
      }

      return acc;
    }, {});
  }

  public static toPlainObjectOnlyFilterFields(params: DrugSignatureInteractionQueryParams): {
    [param: string]: string | string[];
  } {
    const fieldsToIgnore = [ 'page', 'pageSize', 'orderField', 'sortDirection'];

    return Object.keys(params).reduce((acc, key) => {
      if (!fieldsToIgnore.includes(key) && params[key] !== undefined && params[key] !== null) {
        acc[key] = String(params[key]);
      }

      return acc;
    }, {});
  }
}

export enum ExperimentalDesign {
  IN_VIVO = 'IN_VIVO',
  EX_VIVO = 'EX_VIVO',
  IN_VITRO = 'IN_VITRO',
  IN_SILICO = 'IN_SILICO',
  PATIENT = 'PATIENT',
  TRANSFECTION = 'TRANSFECTION',
  UNKNOWN = 'UNKNOWN'
}

export enum SignatureType {
  GENESET = 'GENESET', UPDOWN = 'UPDOWN'
}
