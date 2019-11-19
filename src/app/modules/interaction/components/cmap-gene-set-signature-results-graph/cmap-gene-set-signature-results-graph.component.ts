import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import * as Highcharts from 'highcharts';
import {CmapGeneSetSignatureDrugInteraction} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {CmapGeneSetSignatureResultsDataSource} from '../cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-data-source';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const BrokenAxis = require('highcharts/modules/broken-axis');
const Exporting = require('highcharts/modules/exporting');
const ExportingOffline = require('highcharts/modules/offline-exporting');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
BrokenAxis(Highcharts);
Exporting(Highcharts);
ExportingOffline(Highcharts);

@Component({
  selector: 'app-cmap-gene-set-signature-results-graph',
  templateUrl: './cmap-gene-set-signature-results-graph.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-graph.component.scss']
})
export class CmapGeneSetSignatureResultsGraphComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() public dataSource: CmapGeneSetSignatureResultsDataSource;

  constructor() {
  }

  private static Y_AXIS_MAX = 2.42;
  private static renderedObjects = [];

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;

  public options: any = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      resetZoomButton: {
        position: {
          x: -25,
          y: 0
        }
      },
      height: 700,
      events: {
        render() {
          CmapGeneSetSignatureResultsGraphComponent.addDecorations(this);
        },
        // The load event is triggered in order to launch a resize event. This is done to force the graph to be rendered using the full
        // width available.
        load() {
          setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
          }, 1);
        }
      }
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: true,
      filename: 'drug-prioritization-plot',
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
      chartOptions: {
        chart: {
          events: {
            render() {
              CmapGeneSetSignatureResultsGraphComponent.addDecorations(this);
            }
          }
        }
      }
    },
    xAxis: {
      title: {
        text: 'Association Score',
        style: {
          color: 'black',
          fontSize: '15px'
        }
      },
      min: -100,
      max: 100,
      breaks: [{
        from: -75,
        to: 75,
        breakSize: 1
      }],
      plotLines: [
        {
          color: 'red',
          dashStyle: 'ShortDash',
          value: 90,
          width: 2
        },
        {
          color: 'green',
          dashStyle: 'ShortDash',
          value: -90,
          width: 2
        },
        {
          color: 'gray',
          dashStyle: 'ShortDash',
          value: 75,
          width: 2
        }
      ]
    },
    yAxis: {
      visible: false,
      max: CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX,
      min: 0,
      startOnTick: false,
      endOnTick: false
    },
    tooltip: {
      formatter: function () {
        return CmapGeneSetSignatureResultsGraphComponent.tooltip(this.point);
      }
    },
    series: [
      {
        name: 'Positive TAU',
        data: [],
        color: 'red',
        marker: {
          symbol: 'circle',
          fillColor: '#FF9994',
          lineWidth: 2,
          lineColor: null
        }
      },
      {
        name: 'Negative TAU',
        data: [],
        color: 'green',
        marker: {
          symbol: 'circle',
          fillColor: 'lightgreen',
          lineWidth: 2,
          lineColor: null
        }
      }
    ]
  };

  private static convertFdr(fdr: number): number {
    return Math.abs(Math.log10(fdr));
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
  }

  public ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {

        const positiveTau = data
          .filter(interaction => interaction.tau >= 80)
          .map(this.mapInteraction);

        const negativeTau = data
          .filter(interaction => interaction.tau <= -80)
          .map(this.mapInteraction);

        this.options.series[0]['data'] = positiveTau;
        this.options.series[1]['data'] = negativeTau;

        Highcharts.chart('chart', this.options);
      });
  }

  private static addDecorations(hchart) {
    if (this.renderedObjects.length > 0) {
      this.renderedObjects.forEach(o => o.destroy());
      this.renderedObjects = [];
    }

    const minVisibleX = hchart.xAxis[0].getExtremes().min;
    const maxVisibleX = hchart.xAxis[0].getExtremes().max;
    const minVisibleY = hchart.yAxis[0].getExtremes().min;
    const maxVisibleY = hchart.yAxis[0].getExtremes().max;

    // Upper-right red rectangle for best candidates with positive TAU
    let fromX = Math.max(90, minVisibleX);
    let toX = Math.min(100, maxVisibleX);
    let fromY = Math.min(maxVisibleY, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX);
    let toY = Math.max(minVisibleY, CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.05));
    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawRectFromCoordinates(
      hchart,
      fromX,
      fromY,
      toX,
      toY,
      10
    ).attr({
      fill: '#F5CEC7',
      stroke: 'black',
      'stroke-width': 0
    }).add());

    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawText(
      hchart, 90.5, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX - 0.05, 'BEST CANDIDATES')
      .css({color: 'red', fontWeight: 'bold', opacity: 0.5})
      .add());

    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawText(
      hchart, 90.5, CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.06), 'GOOD CANDIDATES')
      .css({color: 'red', fontWeight: 'bold', opacity: 0.5})
      .add());

    // Upper-left red rectangle for best candidates with negative TAU
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(-90, maxVisibleX);
    fromY = Math.min(maxVisibleY, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX);
    toY = Math.max(minVisibleY, CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.05));
    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawRectFromCoordinates(
      hchart,
      fromX,
      fromY,
      toX,
      toY,
      10
    ).attr({
      fill: '#EEFAEE',
      stroke: 'black',
      'stroke-width': 0
    }).add());

    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawText(
      hchart, -99.5, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX - 0.05, 'BEST CANDIDATES')
      .css({color: 'green', fontWeight: 'bold', opacity: 0.5})
      .add());

    this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawText(
      hchart, -99.5, CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.06), 'GOOD CANDIDATES')
      .css({color: 'green', fontWeight: 'bold', opacity: 0.5})
      .add());

    // Horizontal line to separate interactions at FDR = 0.05
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(100, maxVisibleX);
    if (CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.05) > minVisibleY) {
      this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawPath(
        hchart,
        fromX,
        CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.05),
        toX,
        CmapGeneSetSignatureResultsGraphComponent.convertFdr(0.05)
      ).attr({
        'stroke-width': 1,
        dashstyle: 'ShortDash',
        stroke: '#888'
      }).add());
    }

    // Horizontal line at the X axis for positive TAU interactions
    fromX = Math.max(75, minVisibleX);
    toX = Math.min(100, maxVisibleX);
    if (fromX <= toX) {
      this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawPath(hchart, fromX, minVisibleY, toX, minVisibleY).attr({
        'stroke-width': 5,
        stroke: '#FF7F7F'
      }).add());
    }

    // Horizontal line at the X axis for negative TAU interactions
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(75, maxVisibleX);
    if (fromX <= toX) {
      this.renderedObjects.push(CmapGeneSetSignatureResultsGraphComponent.drawPath(hchart, fromX, minVisibleY, toX, minVisibleY).attr({
        'stroke-width': 5,
        stroke: '#7FBF7F'
      }).add());
    }
  }

  private static toXPixel(hchart, xAxisPos) {
    return hchart.xAxis[0].toPixels(xAxisPos, false);
  }

  private static toYPixel(hchart, yAxisPos) {
    return hchart.yAxis[0].toPixels(yAxisPos, false);
  }

  private static drawText(hchart, atX, atY, text) {
    return hchart.renderer.text(
      text,
      CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, atX),
      CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, atY)
    );
  }

  private static drawRectFromCoordinates(hchart, fromX, fromY, toX, toY, radius) {
    return hchart.renderer.rect(
      CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, fromX),
      CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, fromY),
      CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, toX) - CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, fromX),
      CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, toY) - CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, fromY),
      radius
    );
  }

  private static drawPath(hchart, fromX, fromY, toX, toY) {
    return hchart.renderer.path([
      'M',
      CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, fromX),
      CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, fromY),
      'L',
      CmapGeneSetSignatureResultsGraphComponent.toXPixel(hchart, toX),
      CmapGeneSetSignatureResultsGraphComponent.toYPixel(hchart, toY)
    ]);
  }

  public ngOnDestroy(): void {
    this.dataSourceSubscription.unsubscribe();
    this.dataSourceSubscription = undefined;
    this.loadingSubscription.unsubscribe();
    this.loadingSubscription = undefined;
  }

  public isLoading(): boolean {
    return this.loading;
  }


  private static tooltip(point): string {
    return `
            <b>TAU</b>: ${point.interaction.tau} <br/>
            <b>Up Genes FDR</b>: ${point.interaction.fdr} <br/>
            <b>Drug</b>: ${point.interaction.drug.commonName} <br/>
          `;
  }

  private mapInteraction(interaction: CmapGeneSetSignatureDrugInteraction) {
    return {
      x: interaction.tau,
      y: CmapGeneSetSignatureResultsGraphComponent.convertFdr(
        Math.max(
          interaction.fdr,
          0.005
        )
      ),
      interaction: interaction
    };
  }
}
