import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Drug} from '../../../../models/drug.model';

export interface DrugContainer {
  drug: Drug;
}

@Component({
  selector: 'app-cmap-results-summary',
  templateUrl: './cmap-results-summary.component.html',
  styleUrls: ['./cmap-results-summary.component.scss']
})
export class CmapResultsSummaryComponent implements OnChanges {

  @Input() public data: DrugContainer[];

  public drugStatus: string[];
  public drugMoa: string[];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data !== undefined) {
      const moa: string[][] = this.data.map(d => d.drug.moa);
      setTimeout(() => {
        this.drugStatus = this.data.map(d => d.drug.status);
        this.drugMoa = [].concat(...moa);
      });
    }
  }
}
