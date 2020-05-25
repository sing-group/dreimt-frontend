import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HypergeometricDataModel} from '../../../../models/hypergeometric-data.model';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-hypergeometric-distribution-plot',
  templateUrl: './hypergeometric-distribution-plot.component.html',
  styleUrls: ['./hypergeometric-distribution-plot.component.scss']
})
export class HypergeometricDistributionPlotComponent implements OnInit, OnChanges {
  private static ID = 0;
  public id: number;

  @Input() public data: HypergeometricDataModel[];
  @Input() public chartTitle: string;

  constructor() {
    this.id = HypergeometricDistributionPlotComponent.ID++;
  }

  public options: any = {
    chart: {
      type: 'bar',
      marginRight: 20
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    xAxis: {
      crosshair: true,
      visible: false
    },
    yAxis: {
      visible: false,
      min: 0,
      title: {
        text: '-log10(p-value)'
      },
      startOnTick: false,
      endOnTick: false,
      lineWidth: 0,
      gridLineColor: 'transparent',
      tickInterval: 0.5
    },
    exporting: {
      enabled: true,
      sourceWidth: 600,
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
    tooltip: {
      useHTML: true
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          inside: true
        },
        pointWidth: 30,
        pointPadding: 0.1,
        groupPadding: 0,
        borderWidth: 0,
        shadow: false
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      dataLabels: [{
        align: 'left',
        format: '{point.data.name}',
        style: {
          fontWeight: 'normal',
          color: 'contrast',
          fontSize: '14px',
          textOutline: false
        }
      }],
      data: [{
        name: 'Distribution',
        data: []
      }]
    }]
  };

  /**
   * Initialize the tooltip as described here in order to have access to the component's members
   * https://github.com/gevgeny/angular2-highcharts/issues/177#issuecomment-363109248
   */
  ngOnInit(): void {
    const comp = this;
    this.options.tooltip.formatter = function () {
      return `${this.point.data.name}: ${this.point.data.sampleSuccess}` +
        `<br/> p-value: ${this.point.data.pvalue.toFixed(4)}` +
        `<br/> q-value: ${this.point.data.qvalue.toFixed(4)}` +
        `<br/> Odds ratio: ${this.point.data.oddsRatio.toFixed(4)}`;
    };
  }


  ngOnChanges(): void {
    if (this.data !== undefined) {
      this.options.series[0].data = [];

      this.data
        .sort(function (a, b) {
          return a.pvalue - b.pvalue;
        })
        .slice(0, 10)
        .forEach(d => {
          this.options.series[0].data.push({
            y: Math.abs(Math.log10(d.pvalue)),
            color: d.pvalue < 0.05 ? '#f5085c' : '#d3d3d3',
            data: d
          });
        });

      this.options.exporting.filename = this.chartTitle.toLowerCase().replace(' ', '_');
      this.options.chart.height = this.options.series[0].data.length * 50;

      Highcharts.chart('bar-char-plot-' + this.id, this.options);
    }
  }
}
