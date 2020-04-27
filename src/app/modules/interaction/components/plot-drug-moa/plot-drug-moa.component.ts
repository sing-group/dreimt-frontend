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
    exporting: {
      enabled: true,
      filename: 'drug-moa-plot',
      sourceWidth: 1502,
      scale: 1,
      fallbackToExportServer: false,
      buttons: {
        contextButton: {
          menuItems: [{
            textKey: 'downloadPNG',
            onclick: function () {
              this.exportChart();
              this.redraw();
            }
          }, {
            textKey: 'downloadJPEG',
            onclick: function () {
              this.exportChart({
                type: 'image/jpeg'
              });
              this.redraw();
            }
          }, {
            separator: true
          }, {
            textKey: 'downloadPDF',
            onclick: function () {
              this.exportChart({
                type: 'application/pdf'
              });
              this.redraw();
            }
          }, {
            textKey: 'downloadSVG',
            onclick: function () {
              this.exportChart({
                type: 'image/svg+xml'
              });
              this.redraw();
            }
          }]
        }
      },
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
