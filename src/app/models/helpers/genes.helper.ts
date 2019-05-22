/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2019 - Hugo López-Fernández,
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

import {UpDownGenes} from '../interactions/up-down-gene-set.model';
import {GeneSet} from '../interactions/gene-set.model';

export class GenesHelper {

  public static formatGenes(genes: UpDownGenes | GeneSet, fileFormat: FileFormat): string {
    if (fileFormat === FileFormat.GMT) {
      return this.toGmt(genes);
    } else {
      return this.toGmx(genes);
    }
  }

  private static toGmt(genes: UpDownGenes | GeneSet): string {
    if (UpDownGenes.isA(genes)) {
      return 'UP\tNA\t' + genes.up.join('\t') + '\n' + 'DOWN\tNA\t' + genes.down.join('\t') + '\n';
    } else if (GeneSet.isA(genes)) {
      return 'GS\tNA\t' + genes.genes.join('\t') + '\n';
    }
  }

  private static toGmx(genes: UpDownGenes | GeneSet): string {
    if (UpDownGenes.isA(genes)) {
      let gmxString = 'UP\tDOWN\nNA\tNA\n';
      let up = 0;
      let down = 0;
      while (up < genes.up.length || down < genes.down.length) {
        let upGene = '';
        if (up < genes.up.length) {
          upGene = genes.up[up];
          up++;
        }

        let downGene = '';
        if (down < genes.down.length) {
          downGene = genes.down[down];
          down++;
        }

        gmxString = gmxString + upGene + '\t' + downGene + '\n';
      }

      return gmxString;
    } else if (GeneSet.isA(genes)) {
      return 'GS\nNA\n' + genes.genes.join('\n');
    }
  }
}

export enum FileFormat {
  GMT = 'GMT (Gene Matrix Transposed file format)',
  GMX = 'GMX (Gene MatriX file format)'
}

export namespace FileFormat {
  export function getFileExtension(fileFormat: FileFormat) {
    switch (fileFormat) {
      case FileFormat.GMT:
        return 'gmt';
      case FileFormat.GMX:
        return 'gmx';
    }
  }
}
