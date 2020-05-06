import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-html-dialog',
  templateUrl: './html-dialog.component.html',
  styleUrls: ['./html-dialog.component.scss']
})
export class HtmlDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<HtmlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HtmlDialogData
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

export interface HtmlDialogData {
  title: string;
  html: string;
}
