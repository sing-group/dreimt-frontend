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
import {DatabaseTableComponent} from './components/database-table/database-table.component';
import {DatabaseTableFiltersComponent} from './components/database-table-filters/database-table-filters.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DatabaseRoutingModule} from './database-routing.module';
import {InteractionTypeIconPipe} from './pipes/interaction-type-icon.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {HttpClientModule} from 'ngx-http-client';
import {OrganismPipe} from './pipes/organism.pipe';
import {SignatureViewComponent} from './components/signature-view/signature-view.component';
import {SignatureViewTableComponent} from './components/signature-view-table/signature-view-table.component';
import {ExportGenesDialogComponent} from '../shared/components/export-genes-dialog/export-genes-dialog.component';
import {SignatureViewGraphComponent} from './components/signature-view-graph/signature-view-graph.component';
import {InteractionModule} from '../interaction/interaction.module';

@NgModule({
  declarations: [
    DatabaseTableComponent,
    InteractionTypeIconPipe,
    DatabaseTableFiltersComponent,
    OrganismPipe,
    SignatureViewComponent,
    SignatureViewTableComponent,
    SignatureViewGraphComponent
  ],
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    FormsModule,
    HttpClientModule,
    InteractionModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    ExportGenesDialogComponent
  ],
})
export class DatabaseModule {
}
