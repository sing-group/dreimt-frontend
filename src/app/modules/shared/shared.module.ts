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
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HighlightPipe} from './pipes/highlight.pipe';
import {FilterFieldComponent} from './components/filter-field/filter-field.component';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {PvalueNumberPipePipe} from './pipes/pvalue-number-pipe.pipe';
import {ExportGenesDialogComponent} from './components/export-genes-dialog/export-genes-dialog.component';
import {HtmlDialogComponent} from './components/html-dialog/html-dialog.component';
import {SignatureSummaryInfoComponent} from './components/database-table-signature-info/signature-summary-info.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';

@NgModule({
  declarations: [
    FilterFieldComponent,
    HighlightPipe,
    NumberFieldComponent,
    PvalueNumberPipePipe,
    ExportGenesDialogComponent,
    HtmlDialogComponent,
    SignatureSummaryInfoComponent,
    CapitalizePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
    CapitalizePipe
  ]
})
export class SharedModule {
}
