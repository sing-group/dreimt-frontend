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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalculatedInteractionsTableComponent} from './components/calculated-interactions-table/calculated-interactions-table.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import {QueryService} from './services/query.service';
import {HttpClientModule} from '@angular/common/http';
import {InteractionRoutingModule} from './interaction-routing.module';
import {JaccardQueryPanelComponent} from './components/jaccard-query-panel/jaccard-query-panel.component';
import {CmapQueryPanelComponent} from './components/cmap-query-panel/cmap-query-panel.component';
import {GeneListComponent} from './components/gene-list/gene-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {
  CalculatedInteractionsQueryPanelComponent
} from './components/calculated-interactions-query-panel/calculated-interactions-query-panel.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InteractionRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CalculatedInteractionsQueryPanelComponent,
    CalculatedInteractionsTableComponent,
    CmapQueryPanelComponent,
    GeneListComponent,
    JaccardQueryPanelComponent
  ],
  providers: [
    QueryService
  ]
})
export class InteractionModule {
}
