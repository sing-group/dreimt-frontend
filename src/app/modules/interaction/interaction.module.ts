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
import {ResultsViewComponent} from './components/results-view/results-view.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
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
import {ExportGenesDialogComponent} from './components/export-genes-dialog/export-genes-dialog.component';
import {CmapUpDownSignatureResultsGraphComponent} from './components/cmap-up-down-signature-results-graph/cmap-up-down-signature-results-graph.component';
import {CmapUpDownSignatureResultsViewComponent} from './components/cmap-up-down-signature-results-view/cmap-up-down-signature-results-view.component';
import {CmapGeneSetSignatureResultsViewComponent} from './components/cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-view.component';
import {CmapGeneSetSignatureResultsGraphComponent} from './components/cmap-gene-set-signature-results-graph/cmap-gene-set-signature-results-graph.component';

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
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
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
    ResultsViewComponent,
    CmapQueryPanelComponent,
    ExportGenesDialogComponent,
    GeneListComponent,
    JaccardQueryPanelComponent,
    JaccardResultsTableComponent,
    CmapUpDownSignatureResultsTableComponent,
    CmapGeneSetSignatureResultsTableComponent,
    ExportGenesDialogComponent,
    CmapUpDownSignatureResultsGraphComponent,
    CmapUpDownSignatureResultsViewComponent,
    CmapGeneSetSignatureResultsViewComponent,
    CmapGeneSetSignatureResultsGraphComponent
  ],
  providers: [
    QueryService
  ],
  entryComponents: [
    ExportGenesDialogComponent
  ]
})
export class InteractionModule {
}
