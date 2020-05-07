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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HighlightPipe} from './pipes/highlight.pipe';
import {FilterFieldComponent} from './components/filter-field/filter-field.component';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {PvalueNumberPipePipe} from './pipes/pvalue-number-pipe.pipe';
import {ExportGenesDialogComponent} from './components/export-genes-dialog/export-genes-dialog.component';
import {HtmlDialogComponent} from './components/html-dialog/html-dialog.component';
import {SignatureSummaryInfoComponent} from './components/database-table-signature-info/signature-summary-info.component';
import {CapitalizePipe} from './pipes/capitalize.pipe';
import {PrecalculatedExamplesComponent} from './components/precalculated-examples/precalculated-examples.component';
import { DrugStatusPipePipe } from './pipes/drug-status-pipe.pipe';

@NgModule({
  declarations: [
    FilterFieldComponent,
    HighlightPipe,
    NumberFieldComponent,
    PvalueNumberPipePipe,
    ExportGenesDialogComponent,
    HtmlDialogComponent,
    SignatureSummaryInfoComponent,
    CapitalizePipe,
    PrecalculatedExamplesComponent,
    DrugStatusPipePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  exports: [
    FilterFieldComponent,
    NumberFieldComponent,
    PvalueNumberPipePipe,
    ExportGenesDialogComponent,
    HtmlDialogComponent,
    SignatureSummaryInfoComponent,
    CapitalizePipe,
    PrecalculatedExamplesComponent,
    DrugStatusPipePipe
  ]
})
export class SharedModule {
}
