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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalculatedInteractionsTableComponent} from './components/calculated-interactions-table/calculated-interactions-table.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {QueryService} from './services/query.service';
import {HttpClientModule} from 'ngx-http-client';
import {InteractionRoutingModule} from './interaction-routing.module';
import {JaccardQueryPanelComponent} from './components/jaccard-query-panel/jaccard-query-panel.component';
import {CmapQueryPanelComponent} from './components/cmap-query-panel/cmap-query-panel.component';
import {GeneListComponent} from './components/gene-list/gene-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {JaccardResultsTableComponent} from './components/jaccard-results-table/jaccard-results-table.component';
import {CmapUpDownSignatureResultsTableComponent} from './components/cmap-up-down-signature-results-table/cmap-up-down-signature-results-table.component';
import {ClipboardModule} from 'ngx-clipboard';
import {CmapGeneSetSignatureResultsTableComponent} from './components/cmap-gene-set-signature-results-table/cmap-gene-set-signature-results-table.component';

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InteractionRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSliderModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSortModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CalculatedInteractionsTableComponent,
    CmapQueryPanelComponent,
    GeneListComponent,
    JaccardQueryPanelComponent,
    JaccardResultsTableComponent,
    CmapUpDownSignatureResultsTableComponent,
    CmapGeneSetSignatureResultsTableComponent
  ],
  providers: [
    QueryService
  ]
})
export class InteractionModule {
}
