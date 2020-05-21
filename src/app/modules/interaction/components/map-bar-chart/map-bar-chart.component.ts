import {Component, Input, OnChanges, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {HypergeometricDataModel} from '../../../../models/hypergeometric-data.model';
import {StatisticalTestsService} from '../../../shared/service/statistical-tests.service';

@Component({
  selector: 'app-map-bar-chart',
  templateUrl: './map-bar-chart.component.html',
  styleUrls: ['./map-bar-chart.component.scss']
})
export class MapBarChartComponent implements OnChanges, OnInit {

  private static ID = 0;
  public id: number;

  @Input() public data: Map<string, Set<string>>;
  @Input() public dataDistribution: Map<string, number>;
  @Input() public chartTitle: string;

  private chart;
  private pValuesMap = {};

  getChartTitle = () => {
    return this.chartTitle;
  };

  addHypergeometricTestResults = (data: HypergeometricDataModel[]) => {
    if (this.chart !== undefined) {
      const newDataSeries = [];
      data.sort(function (a, b) {
        return b.sampleSuccess - a.sampleSuccess;
      }).forEach(d => {
        this.pValuesMap[d.name] = d.pvalue;
        if (d.pvalue < 0.05) {
          newDataSeries.push({
            y: d.sampleSuccess,
            actualValue: d.sampleSuccess,
            color: 'red'
          });
        } else {
          newDataSeries.push({
            y: -1,
            actualValue: d.sampleSuccess
          });
        }
      });

      newDataSeries.forEach(d => {
        this.chart.series[1].addPoint(d, false);
      });

      this.chart.redraw();
    }
  };

  constructor(private service: StatisticalTestsService) {
    this.id = MapBarChartComponent.ID++;
  }

  public options: any = {
    chart: {
      type: 'bar'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Dynamic title'
    },
    xAxis: {
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count'
      },
      startOnTick: false,
      endOnTick: false,
      lineWidth: 0,
      gridLineColor: 'transparent',
      tickInterval: 1
    },
    exporting: {
      enabled: true,
      filename: this.getChartTitle(),
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
    tooltip: {
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Cell Type',
      data: []
    }, {
      name: 'Significant',
      type: 'scatter',
      data: [],
      marker: {
        symbol: 'diamond',
        radius: 7
      },
      enableMouseTracking: false
    }]
  };

  /**
   * Initialize the tooltip as described here in order to have access to the component's members
   * https://github.com/gevgeny/angular2-highcharts/issues/177#issuecomment-363109248
   */
  ngOnInit(): void {
    const comp = this;
    this.options.tooltip.formatter = function () {
      const pvalue = comp.pValuesMap[this.point.name];
      const pvalueStr = pvalue !== undefined ? `<br/>p-value: ${pvalue}` : '';
      return `${this.point.name}: ${this.point.y} ${pvalueStr}`;
    };
  }

  ngOnChanges(): void {
    if (this.chartTitle !== undefined) {
      this.options.title.text = this.chartTitle;
    }

    if (this.data !== undefined && this.dataDistribution !== undefined) {
      this.options.xAxis.categories = [];
      this.options.series[0].data = [];
      this.options.series[1].data = [];

      let total = 0;
      const rawData = new Map<string, number>();
      this.data.forEach((values: Set<string>, key: string) => {
        values.forEach(value => {
          if (!rawData.has(value)) {
            rawData.set(value, 0);
          }
          rawData.set(value, rawData.get(value) + 1);
          total = total + 1;
        });
      });

      const testData: HypergeometricDataModel[] = [];

      rawData.forEach((value: number, key: string) => {

        this.options.series[0].data.push({
          y: value,
          name: key
        });

        const population = this.dataDistribution['__TOTAL__'];
        const population_success = this.dataDistribution[key];
        const sample = total;
        const sample_success = value;

        testData.push({
          name: key,
          populationSize: population,
          populationSuccess: population_success,
          sampleSize: sample,
          sampleSuccess: sample_success
        });
      });

      this.options.series[0].data = this.options.series[0].data.sort(function (data1, data2) {
        return data2.y - data1.y;
      });

      this.options.xAxis.categories = this.options.series[0].data.map(point => point.name);

      this.chart = Highcharts.chart('bar-char-plot-' + this.id, this.options);

      if (testData.length > 0) {
        this.service.hypergeometricTest(testData).subscribe(results => {
          this.addHypergeometricTestResults(results);
        });
      }
    }
  }
}
