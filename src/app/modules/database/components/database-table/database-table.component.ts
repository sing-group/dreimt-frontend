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
  private positiveTauColorMap;
  private negativeTauColorMap;

  constructor(
    private service: InteractionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.debounceTime = 500;
    this.maxOptions = 100;

    this.dataSource = new DatabaseDataSource(this.service);
    this.columns = [
      'drug', 'signature', 'tau', 'upFdr', 'downFdr',
      'cellTypeA', 'cellTypeB', 'cellSubtypeA', 'cellSubtypeB',
      'disease', 'additional-info'
    ];

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

  public applyDatabaseFilters(newFilterParams: DatabaseQueryParams, defaultPageIndex = 0, defaultPageSize = 50): void {
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
    tooltip = tooltip + '\nMOA: ' + interaction.drug.moa;

    return tooltip;
  }

  public signatureNameTooltip(interaction: DrugCellDatabaseInteraction): string {
    let tooltip = 'Signature: ' + interaction.signature.signatureName;
    tooltip = tooltip + '\nSignature Source DB: ' + interaction.signature.sourceDb;
    if (interaction.signature.articleTitle) {
      tooltip = tooltip + '\nArticle title: ' + interaction.signature.articleTitle;
    }
    if (interaction.signature.articleAuthors) {
      var articleAuthors = '';
      if (interaction.signature.articleAuthors.indexOf(',') != -1) {
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

  public getTauTagCssClass(interaction: DrugCellDatabaseInteraction, targetCell: string): string {
    let tauInteractionMode = this.getTauInteractionMode(interaction, targetCell);

    switch (tauInteractionMode) {
      case 'BOOST':
        return 'text-tag-tau text-tag-tau-boost';
      case 'REVERT':
        return 'text-tag-tau text-tag-tau-revert';
      default:
        return 'text-tag-tau-none';
    }
  }

  public getCellSubtypeIcon(interaction: DrugCellDatabaseInteraction, targetCell: string): string {
    let tauInteractionMode = this.getTauInteractionMode(interaction, targetCell);

    switch (tauInteractionMode) {
      case 'BOOST':
        return 'cancel';
      case 'REVERT':
        return 'remove_circle';
      default:
        return 'undo';
    }
  }

  public getTauInteractionMode(interaction: DrugCellDatabaseInteraction, targetCell: string): string {
    let boost;
    let revert;
    let signatureType = interaction.signature.signatureType;

    if (signatureType === 'UPDOWN') {
      if (!interaction.downFdr) {
        signatureType = 'UP';
      } else if (!interaction.upFdr) {
        signatureType = 'DOWN';
      }
    }

    switch (signatureType) {
      case 'UPDOWN':
      case 'UP':
      case 'GENESET':
        if (interaction.tau >= 90) {
          boost = 'A';
          revert = 'B';
        } else if (interaction.tau <= -90) {
          boost = 'B';
          revert = 'A';
        } else {
          boost = 'NONE';
        }
        break;
      case 'DOWN':
        if (interaction.tau >= 90) {
          boost = 'B';
          revert = 'A';
        } else if (interaction.tau <= -90) {
          boost = 'A';
          revert = 'B';
        } else {
          boost = 'NONE';
        }
        break;
    }

    if (boost !== 'NONE') {
      if (targetCell === boost) {
        return 'BOOST';
      } else {
        return 'REVERT';
      }
    } else {
      return 'NONE';
    }
  }

  public getTauTooltip(interaction: DrugCellDatabaseInteraction): string {
    var action = ' boosts';
    if (interaction.tau < 0) {
      action = ' reverts';
    }
    return 'The drug ' + interaction.drug.commonName + action + ' the signature ' + interaction.signature.signatureName + '.';
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

  public navigateToSignature(signature: string): void {
    this.router.navigate(['/database/signature', {signature: signature}]);
  }
}
