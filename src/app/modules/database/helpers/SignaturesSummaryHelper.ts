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

import {DrugCellDatabaseInteraction} from '../../../models/database/drug-cell-database-interaction.model';
import {InteractionType} from '../../../models/interaction-type.enum';

export class SignaturesSummaryHelper {
  private static COLLAPSE_TREATMENTS = ['Overexpression', 'Knock-out model'];

  private mapTreatmentA = {};
  private mapTreatmentB = {};

  constructor() {
  }

  public getInteractionSummary(interaction: DrugCellDatabaseInteraction): string {
    return this.getSummary(
      interaction.interactionType, interaction.signature.signatureName, interaction.drug.commonName, interaction.tau,
      interaction.signature.stateA, interaction.signature.cellTypeA,
      interaction.signature.cellSubTypeA, interaction.signature.treatmentA, interaction.signature.diseaseA,
      interaction.signature.stateB, interaction.signature.cellTypeB,
      interaction.signature.cellSubTypeB, interaction.signature.treatmentB, interaction.signature.diseaseB
    );
  }

  public getSummary(
    interactionType: InteractionType, signatureName: string, drugCommonName: string, tau: number,
    stateA: string, cellTypeA: string[], cellSubTypeA: string[], treatmentA: string[], diseaseA: string[],
    stateB: string, cellTypeB: string[], cellSubTypeB: string[], treatmentB: string[], diseaseB: string[]
  ): string {
    let first = 'A';
    if (interactionType === InteractionType.SIGNATURE_DOWN) {
      first = 'B';
    }

    let addComparedTo = true;
    if (interactionType === InteractionType.GENESET) {
      addComparedTo = false;
    }

    let effect = 'boosts';
    if (tau < 0) {
      effect = 'inhibits';
    }

    if (first === 'A') {
      return SignaturesSummaryHelper._getExplanation(
        signatureName, effect, drugCommonName, addComparedTo,
        stateA, cellSubTypeA, treatmentA, diseaseA, this.mapTreatmentA,
        stateB, cellSubTypeB, treatmentB, diseaseB, this.mapTreatmentB
      );
    } else {
      return SignaturesSummaryHelper._getExplanation(
        signatureName, effect, drugCommonName, addComparedTo,
        stateB, cellSubTypeB, treatmentB, diseaseB, this.mapTreatmentB,
        stateA, cellSubTypeA, treatmentA, diseaseA, this.mapTreatmentA
      );
    }
  }

  private static _getExplanation(
    signatureName: string, effect: string, drug: string, addComparedTo: boolean,
    stateA: string, subTypeA: string[], treatmentA: string[], diseaseA: string[], mapTreatmentA,
    stateB: string, subTypeB: string[], treatmentB: string[], diseaseB: string[], mapTreatmentB
  ): string {

    const treatmentAStr = treatmentA.length > 0 ?
      ` <span class="prediction-summary-treatment">stimulated with ${
        this.concat(SignaturesSummaryHelper.collapseTreatments(treatmentA, signatureName, mapTreatmentA))
        } </span> ` : '';
    const diseaseAStr = diseaseA.length > 0 ? ` <span class="prediction-summary-disease">in ${this.concat(diseaseA)} </span>` : '';

    let explanation = `<span class="prediction-summary-drug"> ${drug} </span> <span class="prediction-summary-${effect}">${effect}</span> ${stateA} <b>
        ${subTypeA.join('/')}</b> ${treatmentAStr}${diseaseAStr}`;

    if (addComparedTo) {
      const treatmentBStr = treatmentB.length > 0 ?
        ` <span class="prediction-summary-treatment">stimulated with ${
          this.concat(SignaturesSummaryHelper.collapseTreatments(treatmentB, signatureName, mapTreatmentB))
          } </span> ` : '';
      const diseaseBStr = diseaseB.length > 0 ? ` <span class="prediction-summary-disease">in ${this.concat(diseaseB)} </span>` : '';

      explanation = explanation + `<span class="prediction-summary"> compared to</span> ${stateB} <b>
        ${subTypeB.join('/')}</b> ${treatmentBStr}${diseaseBStr}`;
    }

    return explanation;
  }

  private static collapseTreatments(treatments: string[], signatureName: string, treatmentsMap): string[] {
    if (treatmentsMap[signatureName] === undefined) {
      const collapseMap = {};
      const result = [];
      for (let i = 0; i < treatments.length; i++) {
        const treatment = treatments[i];
        let collapse = false;

        for (let j = 0; j < SignaturesSummaryHelper.COLLAPSE_TREATMENTS.length && collapse === false; j++) {
          const keyword = SignaturesSummaryHelper.COLLAPSE_TREATMENTS[j];
          if (treatment.startsWith(keyword)) {
            const treatmentValue = treatment
              .replace(keyword, '').replace('[', '').replace(']', '').trim();
            if (collapseMap[keyword] === undefined) {
              collapseMap[keyword] = [];
            }
            collapseMap[keyword].push(treatmentValue);
            collapse = true;
          }
        }

        if (!collapse) {
          result.push(treatment);
        }
      }

      for (const treatment in collapseMap) {
        result.push(treatment + ' (' + collapseMap[treatment].join(', ') + ')');
      }

      treatmentsMap[signatureName] = result;
    }

    return treatmentsMap[signatureName];
  }

  private static concat(data: string[]) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      if (i > 0 && i === (data.length - 1)) {
        result = result + ' and ';
      } else if (i > 0) {
        result = result + ', ';
      }
      result = result + data[i];
    }

    return result;
  }
}
