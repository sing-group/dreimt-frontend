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

export class DrugTargetGene {
  public readonly geneName: string;
  public readonly geneId: string;

  public static isA(object: any): object is DrugTargetGene {
    return object !== undefined && object !== null
      && typeof object.geneName === 'string'
      && typeof object.geneId === 'string';
  }
}

export class Drug {
  public readonly commonName: string;
  public readonly sourceName: string;
  public readonly sourceDb: string;
  public readonly status: string;
  public readonly moa: string[];
  public readonly targetGenes: DrugTargetGene[];
  public readonly dss: number;
  public readonly pubChemId: string;
  public readonly dbProfilesCount: number;

  public static isA(object: any): object is Drug {
    return object !== undefined && object !== null
      && typeof object.commonName === 'string'
      && typeof object.sourceName === 'string'
      && typeof object.sourceDb === 'string'
      && typeof object.status === 'string'
      && typeof object.dss === 'number'
      && typeof object.pubChemId === 'string'
      && typeof object.dbProfilesCount === 'number'
      && object.moa.every(function (i) {
        return typeof i === 'string';
      })
      && object.targetGenes.every(function (i) {
        return DrugTargetGene.isA(i);
      });
  }

  public static getPubChemLink(drug: Drug): string {
    if (drug.pubChemId) {
      return 'https://pubchem.ncbi.nlm.nih.gov/compound/' + drug.pubChemId;
    } else {
      return 'https://pubchem.ncbi.nlm.nih.gov/#query=' + drug.commonName;
    }
  }

  public static getTooltip(drug: Drug): string {
    let tooltip = '';

    if (drug.sourceName) {
      tooltip = tooltip + 'Source name: ' + drug.sourceName;
    }

    if (drug.targetGenes.length > 0) {
      const targetGenes = drug.targetGenes.map(function (x) {
        return x.geneName + (x.geneId === 'NA' ? '' : '(' + x.geneId + ')');
      });
      tooltip = tooltip + '\nTarget genes: ' + targetGenes;
    }

    if (drug.dbProfilesCount > 1) {
      tooltip = tooltip + '\n\nWarning: this drug contains multiple drug profiles in DREIMT (multiple Broad IDs). ' +
        'Contradictory conflicting results might appear.';
    }

    return tooltip;
  }
}
