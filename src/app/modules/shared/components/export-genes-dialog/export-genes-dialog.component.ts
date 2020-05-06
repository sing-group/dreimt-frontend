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

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileFormat} from '../../../../models/helpers/genes.helper';

@Component({
  selector: 'app-export-genes-dialog',
  templateUrl: './export-genes-dialog.component.html',
  styleUrls: ['./export-genes-dialog.component.scss']
})
export class ExportGenesDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ExportGenesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  title: string;
  onlyUniverseGenes: boolean;
  fileFormats: FileFormat[];
  fileFormat: FileFormat;
}
