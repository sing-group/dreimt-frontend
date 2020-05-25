import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {HypergeometricDataModel} from '../../../../models/hypergeometric-data.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-hypergeometric-distribution-table',
  templateUrl: './hypergeometric-distribution-table.component.html',
  styleUrls: ['./hypergeometric-distribution-table.component.scss']
})
export class HypergeometricDistributionTableComponent implements OnChanges {

  public dataSource: MatTableDataSource<HypergeometricDataModel>;
  public displayedColumns: string[] = ['name', 'pvalue', 'qvalue', 'count', 'odds'];

  @Input() public data: HypergeometricDataModel[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() {
  }

  ngOnChanges(): void {
    if (this.data !== undefined) {
      this.dataSource = new MatTableDataSource<HypergeometricDataModel>(this.data);
      this.dataSource.paginator = this.paginator;
    }
  }
}
