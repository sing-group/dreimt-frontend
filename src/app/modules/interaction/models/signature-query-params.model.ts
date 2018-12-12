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

export class JaccardSignatureQueryParams {
  public readonly cellTypeA?: string;
  public readonly cellTypeB?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly disease?: string;
  public readonly organism?: string;
  public readonly signatureSourceDb?: string;
  public readonly signatureType?: SignatureType;
  public readonly onlyUniverseGenes?: boolean;

  public static toPlainObject(params: JaccardSignatureQueryParams): {
    [param: string]: string | string[];
  } {
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = String(params[key]);
      }

      return acc;
    }, {});
  }
}

export class CmapSignatureQueryParams {
  public readonly numPerm: number;
  public readonly maxPvalue: number;

  public static toPlainObject(params: CmapSignatureQueryParams): {
    [param: string]: string | string[];
  } {
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = String(params[key]);
      }

      return acc;
    }, {});
  }

  public static isCmapSignatureQueryParams(object: any): object is CmapSignatureQueryParams {
    return object.numPerm !== undefined && object.maxPvalue !== undefined;
  }
}

function isStringArray(object: any): object is string[] {
  return Array.isArray(object) && object.every(item => typeof item === 'string');
}

export class UpDownGenes {
  public readonly upGenes: string[];
  public readonly downGenes: string[];

  public static isUpDownGenes(object: any): object is UpDownGenes {
    return isStringArray(object.upGenes) && isStringArray(object.downGenes);
  }
}

export class GeneSet {
  public readonly genes: string[];

  public static isGeneSet(object: any): object is GeneSet {
    return isStringArray(object.genes);
  }
}

export class QueryParams {
  params: JaccardSignatureQueryParams | CmapSignatureQueryParams;
  genes: UpDownGenes | GeneSet;

  public static toPlainObject(params: any): {
    [param: string]: string | string[];
  } {
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = String(params[key]);
      }

      return acc;
    }, {});
  }

}

/**
 * TODO: share this enums with database module?
 */

export enum ExperimentalDesign {
  IN_VIVO, EX_VIVO, IN_VITRO, IN_SILICO, PATIENT, TRANSFECTION, UNKNOWN
}

export enum SignatureType {
  GENESET, UPDOWN
}
