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

export enum DrugSignatureInteractionField {
  NONE = 'NONE',
  CELL_TYPE_A = 'CELL_TYPE_A',
  CELL_SUBTYPE_A = 'CELL_SUBTYPE_A',
  CELL_TYPE_B = 'CELL_TYPE_B',
  CELL_SUBTYPE_B = 'CELL_SUBTYPE_B',
  SIGNATURE_NAME = 'SIGNATURE_NAME',
  EXPERIMENTAL_DESIGN = 'EXPERIMENTAL_DESIGN',
  ORGANISM = 'ORGANISM',
  DISEASE = 'DISEASE',
  SIGNATURE_SOURCE_DB = 'SIGNATURE_SOURCE_DB',
  SIGNATURE_TYPE = 'SIGNATURE_TYPE',
  DRUG_SOURCE_NAME = 'DRUG_SOURCE_NAME',
  DRUG_SOURCE_DB = 'DRUG_SOURCE_DB',
  DRUG_COMMON_NAME = 'DRUG_COMMON_NAME',
  INTERACTION_TYPE = 'INTERACTION_TYPE',
  TAU = 'TAU',
  UP_FDR = 'UP_FDR',
  DOWN_FDR = 'DOWN_FDR'
}
