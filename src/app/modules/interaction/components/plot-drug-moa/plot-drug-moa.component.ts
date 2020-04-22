import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-plot-drug-moa',
  templateUrl: './plot-drug-moa.component.html',
  styleUrls: ['./plot-drug-moa.component.scss']
})
export class PlotDrugMoaComponent implements OnChanges {

  @Input() public drugMoa: string[];

  constructor() {
  }

  public options: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Drugs by MOA'
    },
    tooltip: {
      pointFormat: '{point.y} drugs ({point.percentage:.1f}%)'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }
    },
    series: [{
      name: 'Drugs',
      colorByPoint: true,
      data: []
    }]
  };

  ngOnChanges(changes: SimpleChanges) {
    if (this.drugMoa !== undefined) {
      console.log(this.drugMoa);
      const moaCounts = {};
      for (let i = 0; i < this.drugMoa.length; i++) {
        const moa = this.drugMoa[i];
        moaCounts[moa] =
          moa in moaCounts ? moaCounts[moa] + 1 : 1;
      }

      this.options.series[0].data = [];
      for (const moa in moaCounts) {
        this.options.series[0].data.push(
          {
            name: moa,
            y: moaCounts[moa],
            sliced: true,
            selected: true
          }
        );
      }

      this.options.series[0].data = this.options.series[0].data.sort(function (data1, data2) {
        return data1.y - data2.y;
      });

      Highcharts.chart('plot-drug-moa', this.options);
    }
  }
}
