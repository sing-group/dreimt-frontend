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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InteractionsService} from '../../services/interactions.service';
import {DatabaseDataSource} from './database-data-source';
import {MatPaginator, MatSort} from '@angular/material';
import {debounceTime} from 'rxjs/operators';
import {DatabaseQueryParams} from '../../../../models/database/database-query-params.model';
import {SortDirection} from '../../../../models/sort-direction.enum';
import {DrugSignatureInteractionField} from '../../../../models/drug-signature-interaction-field.enum';
import {ExperimentalDesign} from '../../../../models/experimental-design.enum';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DatabaseTableFiltersComponent} from '../database-table-filters/database-table-filters.component';
import {InteractionType} from '../../../../models/interaction-type.enum';

@Component({
  selector: 'app-database',
  templateUrl: './database-table.component.html',
  styleUrls: ['./database-table.component.scss']
})
export class DatabaseTableComponent implements AfterViewInit, OnInit {
  public readonly debounceTime: number;
  public readonly maxOptions: number;

  public readonly columns: string[];
  public readonly dataSource: DatabaseDataSource;

  public totalResultsSize: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(DatabaseTableFiltersComponent) private databaseTableFiltersComponent: DatabaseTableFiltersComponent;

  private filterParams: DatabaseQueryParams;
  private readonly positiveTauColorMap;
  private readonly negativeTauColorMap;

  private static COLLAPSE_TREATMENTS = ['Overexpression', 'Knock-out model'];
  private mapTreatmentA = {};
  private mapTreatmentB = {};

  constructor(
    private service: InteractionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new DatabaseDataSource(this.service);
    this.columns = ['drug', 'summary', 'cellTypeA', 'cellTypeB', 'signature', 'tau', 'dss', 'upFdr', 'downFdr', 'additional-info'];

    this.filterParams = {};

    const interpolate = require('color-interpolate');
    this.positiveTauColorMap = interpolate(['tomato', 'red']);
    this.negativeTauColorMap = interpolate(['lightgreen', 'darkgreen']);
  }

  public ngOnInit(): void {
    this.initSort();

    this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
    this.setInitialQueryParams(this.route.snapshot.queryParamMap);
  }

  private setInitialQueryParams(params: ParamMap): void {
    this.databaseTableFiltersComponent.setFilters(params);
  }

  public initSort(): void {
    this.sort.active = 'TAU';
    this.sort.direction = 'desc';
  }

  public ngAfterViewInit(): void {
    this.sort.sortChange.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => {
      this.resetPage();
      this.updatePage();
    });

    this.paginator.page.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => this.updatePage());
  }

  public getExperimentalDesignValues(): string[] {
    return Object.keys(ExperimentalDesign)
      .filter(key => !isNaN(Number(ExperimentalDesign[key])));
  }

  private resetPage(): void {
    this.paginator.pageIndex = 0;
  }

  private updatePage(queryParams = this.createQueryParameters()): void {
    this.dataSource.list(queryParams);
  }

  private sortDirection(): SortDirection {
    switch (this.sort.direction) {
      case 'asc':
        return SortDirection.ASCENDING;
      case 'desc':
        return SortDirection.DESCENDING;
      default:
        return undefined;
    }
  }

  private orderField(): DrugSignatureInteractionField {
    if (this.sortDirection() !== undefined) {
      return DrugSignatureInteractionField[this.sort.active];
    } else {
      return undefined;
    }
  }

  public applyDatabaseFilters(newFilterParams: DatabaseQueryParams): void {
    this.filterParams = newFilterParams;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.filterParams
      });
    this.updatePage(this.createQueryParameters());
  }

  public createQueryParameters(defaultPageIndex = 0, defaultPageSize = 50): DatabaseQueryParams {
    return {
      page: this.paginator.pageIndex || defaultPageIndex,
      pageSize: this.paginator.pageSize || defaultPageSize,
      sortDirection: this.sortDirection(),
      orderField: this.orderField(),
      ...this.filterParams
    };
  }

  public drugTooltip(interaction: DrugCellDatabaseInteraction): string {
    let tooltip = 'Source name: ' + interaction.drug.sourceName;
    tooltip = tooltip + '\nStatus: ' + interaction.drug.status;
    if (interaction.drug.targetGenes.length > 0) {
      tooltip = tooltip + '\nTarget genes: ' + interaction.drug.targetGenes;
    }
    tooltip = tooltip + '\nDSS: ' + interaction.drug.dss;

    return tooltip;
  }

  public signatureNameTooltip(interaction: DrugCellDatabaseInteraction): string {
    let tooltip = 'Signature: ' + interaction.signature.signatureName;
    tooltip = tooltip + '\nSignature Source DB: ' + interaction.signature.sourceDb;
    if (interaction.signature.articleTitle) {
      tooltip = tooltip + '\nArticle title: ' + interaction.signature.articleTitle;
    }
    if (interaction.signature.articleAuthors) {
      let articleAuthors = '';
      if (interaction.signature.articleAuthors.indexOf(',') !== -1) {
        articleAuthors = interaction.signature.articleAuthors.substring(0, interaction.signature.articleAuthors.indexOf(',')) + ' et al.';
      } else {
        articleAuthors = interaction.signature.articleAuthors;
      }
      tooltip = tooltip + '\nArticle authors: ' + articleAuthors;
    }
    if (interaction.signature.articlePubMedId) {
      tooltip = tooltip + '\nPubMed ID: ' + interaction.signature.articlePubMedId;
    }
    return tooltip;
  }

  public getTauStyleColor(tau: number): string {
    if (tau >= 90) {
      return this.positiveTauColorMap((tau - 90) / 10);
    } else if (tau <= -90) {
      return this.negativeTauColorMap((Math.abs(tau) - 90) / 10);
    } else {
      return 'black';
    }
  }

  public getExperimentalDesignAcronym(experimentalDesign: string): string {
    switch (experimentalDesign) {
      case 'IN_VIVO':
        return 'VI';
      case 'EX_VIVO':
        return 'EV';
      case 'IN_VITRO':
        return 'VT';
      case 'IN_SILICO':
        return 'IS';
      case 'PATIENT':
        return 'PA';
      case 'TRANSFECTION':
        return 'TR';
      case 'UNKNOWN':
      default:
        return 'UN';
    }
  }

  public getInteractionTypeAcronym(interactionType: InteractionType): string {
    switch (interactionType) {
      case InteractionType.GENESET:
        return 'G';
      case InteractionType.SIGNATURE:
        return 'S';
      case InteractionType.SIGNATURE_UP:
        return 'UP';
      case InteractionType.SIGNATURE_DOWN:
        return 'DN';
    }
  }

  public getSummary(interaction: DrugCellDatabaseInteraction): string {
    let first = 'A';
    if (interaction.interactionType === InteractionType.SIGNATURE_DOWN) {
      first = 'B';
    }

    let effect = 'boosts';
    if (interaction.tau < 0) {
      effect = 'inhibits';
    }

    if (first === 'A') {
      return this._getExplanation(
        interaction.signature.signatureName, effect, interaction.drug.commonName,
        interaction.signature.stateA, interaction.signature.cellSubTypeA, interaction.signature.treatmentA, interaction.signature.diseaseA,
        interaction.signature.stateB, interaction.signature.cellSubTypeB, interaction.signature.treatmentB, interaction.signature.diseaseB
      );
    } else {
      return this._getExplanation(
        interaction.signature.signatureName, effect, interaction.drug.commonName,
        interaction.signature.stateB, interaction.signature.cellSubTypeB, interaction.signature.treatmentB, interaction.signature.diseaseB,
        interaction.signature.stateA, interaction.signature.cellSubTypeA, interaction.signature.treatmentA, interaction.signature.diseaseA
      );
    }
  }

  private _getExplanation(
    signatureName: string, effect: string, drug: string,
    stateA: string, subTypeA: string[], treatmentA: string[], diseaseA: string[],
    stateB: string, subTypeB: string[], treatmentB: string[], diseaseB: string[],
  ): string {
    const treatmentAStr = treatmentA.length > 0 ?
      ` <span class="explanation-treatment">stimulated with ${
        this.concat(DatabaseTableComponent.collapseTreatments(treatmentA, signatureName, this.mapTreatmentA))
        } </span> ` : '';

    const treatmentBStr = treatmentB.length > 0 ?
      ` <span class="explanation-treatment">stimulated with ${
        this.concat(DatabaseTableComponent.collapseTreatments(treatmentB, signatureName, this.mapTreatmentB))
        } </span> ` : '';

    const diseaseAStr = diseaseA.length > 0 ? ` <span class="explanation-disease">in ${this.concat(diseaseA)} </span>` : '';
    const diseaseBStr = diseaseB.length > 0 ? ` <span class="explanation-disease">in ${this.concat(diseaseB)} </span>` : '';

    return `<span class="explanation-drug"> ${drug} </span> <span class="explanation-${effect}">${effect}</span> ${stateA} <b>
        ${subTypeA.join('/')}</b> ${treatmentAStr}${diseaseAStr}<span class="explanation"> compared to</span> ${stateB} <b>
        ${subTypeB.join('/')}</b> ${treatmentBStr}${diseaseBStr}`;
  }

  private static collapseTreatments(treatments: string[], signatureName: string, treatmentsMap): string[] {
    if (treatmentsMap[signatureName] === undefined) {
      const collapseMap = {};
      const result = [];
      for (let i = 0; i < treatments.length; i++) {
        const treatment = treatments[i];
        let collapse = false;

        for (let j = 0; j < DatabaseTableComponent.COLLAPSE_TREATMENTS.length && collapse === false; j++) {
          const keyword = DatabaseTableComponent.COLLAPSE_TREATMENTS[j];
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

  private concat(data: string[]) {
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

  public navigateToSignature(signature: string): void {
    this.router.navigate(['/database/signature'], {queryParams: {signature: signature}});
  }

  public downloadCsv() {
    this.service.downloadCsv({
      sortDirection: SortDirection.ASCENDING,
      orderField: DrugSignatureInteractionField.TAU,
      ...this.filterParams
    });
  }

  public downloadCsvTooltip(): string {
    return this.isDownloadCsvDisabled() ? 'Please, select upt to 1000 predictions to download them as CSV. For larger queries, use the API.' : '';
  }

  public isDownloadCsvDisabled(): boolean {
    return this.totalResultsSize === undefined || this.totalResultsSize === 0 || this.totalResultsSize > 1000;
  }
}
