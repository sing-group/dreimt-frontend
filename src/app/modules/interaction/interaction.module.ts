/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2020 - Hugo López-Fernández,
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
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
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
import {ExportGenesDialogComponent} from '../shared/components/export-genes-dialog/export-genes-dialog.component';
import {CmapUpDownSignatureResultsGraphComponent} from './components/cmap-up-down-signature-results-graph/cmap-up-down-signature-results-graph.component';
import {CmapUpDownSignatureResultsViewComponent} from './components/cmap-up-down-signature-results-view/cmap-up-down-signature-results-view.component';
import {CmapGeneSetSignatureResultsViewComponent} from './components/cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-view.component';
import {CmapGeneSetSignatureResultsGraphComponent} from './components/cmap-gene-set-signature-results-graph/cmap-gene-set-signature-results-graph.component';
import {TwoGeneListsComponent} from './components/two-gene-lists/two-gene-lists.component';
import {PlotDrugStatusComponent} from './components/plot-drug-status/plot-drug-status.component';
import {PlotDrugMoaComponent} from './components/plot-drug-moa/plot-drug-moa.component';
import {CmapDrugResultsSummaryComponent} from './components/cmap-results-summary/cmap-drug-results-summary.component';
import {HtmlDialogComponent} from '../shared/components/html-dialog/html-dialog.component';
import {JaccardResultsViewComponent} from './components/jaccard-results-view/jaccard-results-view.component';

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
    GeneListComponent,
    JaccardQueryPanelComponent,
    JaccardResultsTableComponent,
    CmapUpDownSignatureResultsTableComponent,
    CmapGeneSetSignatureResultsTableComponent,
    CmapUpDownSignatureResultsGraphComponent,
    CmapUpDownSignatureResultsViewComponent,
    CmapGeneSetSignatureResultsViewComponent,
    CmapGeneSetSignatureResultsGraphComponent,
    TwoGeneListsComponent,
    PlotDrugStatusComponent,
    PlotDrugMoaComponent,
    CmapDrugResultsSummaryComponent,
    JaccardResultsViewComponent
  ],
  exports: [
    CmapDrugResultsSummaryComponent
  ],
  providers: [
    QueryService
  ],
  entryComponents: [
    ExportGenesDialogComponent,
    HtmlDialogComponent
  ]
})
export class InteractionModule {
}
