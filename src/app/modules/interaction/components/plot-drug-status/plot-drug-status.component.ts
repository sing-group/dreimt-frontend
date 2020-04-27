import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-plot-drug-status',
  templateUrl: './plot-drug-status.component.html',
  styleUrls: ['./plot-drug-status.component.scss']
})
export class PlotDrugStatusComponent implements OnChanges {

  @Input() public drugStatus: string[];

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
      text: 'Drugs by approval status'
    },
    tooltip: {
      pointFormat: '{point.y} drugs ({point.percentage:.1f}%)</b>'
    },
    exporting: {
      enabled: true,
      filename: 'drug-status-plot',
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
    if (this.drugStatus !== undefined) {
      let approved = 0;
      let withdrawn = 0;
      let experimental = 0;

      for (let i = 0; i < this.drugStatus.length; i++) {
        if (this.drugStatus[i] === 'APPROVED') {
          approved++;
        }
        if (this.drugStatus[i] === 'WITHDRAWN') {
          withdrawn++;
        }
        if (this.drugStatus[i] === 'EXPERIMENTAL') {
          experimental++;
        }
      }

      let count = 0;
      if (approved > 0) {
        this.options.series[0].data[count++] = {
          name: 'Approved',
          sliced: true,
          selected: true,
          color: '#2BBE83',
          y: approved
        };
      }
      if (experimental > 0) {
        this.options.series[0].data[count++] = {
          name: 'Experimental',
          color: '#FFCF3A',
          y: experimental
        };
      }
      if (withdrawn > 0) {
        this.options.series[0].data[count++] = {
          name: 'Withdrawn',
          color: '#337BB7',
          y: withdrawn
        };
      }

      this.options.series[0].data = this.options.series[0].data.sort(function (data1, data2) {
        return data1.y - data2.y;
      });

      Highcharts.chart('plot-drug-status', this.options);
    }
  }
}
