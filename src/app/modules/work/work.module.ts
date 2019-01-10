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
import {MatButtonModule, MatDialogModule, MatIconModule, MatListModule, MatTableModule, MatTooltipModule} from '@angular/material';
import {WorkListComponent} from './components/work-list/work-list.component';
import {WorkService} from './services/work.service';
import {ExecutionStatusIconPipe} from './pipes/execution-status-icon.pipe';
import {ConfirmDeletionDialogComponent} from './components/work-list/confirm-deletion-dialog.component';

@NgModule({
  declarations: [
    ConfirmDeletionDialogComponent,
    ExecutionStatusIconPipe,
    WorkListComponent
  ],
  entryComponents: [
    ConfirmDeletionDialogComponent
  ],
  exports: [
    WorkListComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [
    WorkService
  ]
})
export class WorkModule {
}
