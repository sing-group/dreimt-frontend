/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2020 - Hugo López-Fernández,
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

import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import * as Highcharts from 'highcharts';
import {CmapGeneSetSignatureDrugInteraction} from '../../../../models/interactions/cmap-gene-set/cmap-gene-set-signature-drug-interaction.model';
import {CmapGeneSetSignatureResultsDataSource} from '../cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-data-source';
import {MatDialog} from '@angular/material/dialog';
import {HtmlDialogComponent} from '../../../shared/components/html-dialog/html-dialog.component';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {formatTitle} from '../../../../utils/types';
import {GeneSetType} from '../../../../models/geneset-type.enum';
import {CapitalizePipe} from '../../../shared/pipes/capitalize.pipe';

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
export class CmapGeneSetSignatureResultsGraphComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  private static DIALOG: MatDialog;

  private static TAU_THRESHOLD = 75;
  private static Y_AXIS_MAX = 3.1;
  private static Y_AXIS_MAX_FDR = 0.001;
  private static renderedObjects = [];
  private static OVERLAPPING_INTERACTIONS_MAP = new Map();
  private static POSITIVE_TAU_COLOR = 'red';
  private static POSITIVE_TAU_MARKER_FILL_COLOR = '#FF9994';
  private static NEGATIVE_TAU_COLOR = 'green';
  private static NEGATIVE_TAU_MARKER_FILL_COLOR = 'lightgreen';

  private static CAPITALIZE_PIPE = new CapitalizePipe();

  @Input() public dataSource: CmapGeneSetSignatureResultsDataSource;
  @Input() public geneSetType: GeneSetType;

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
      text: 'Drug prioritization plot'
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
        text: 'Association score (tau)',
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
      ],
      tickInterval: 10
    },
    yAxis: {
      title: {
        text: '-log10(FDR)',
        style: {
          color: 'black',
          fontSize: '15px'
        },
        margin: 20,
      },
      visible: true,
      max: CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX,
      min: 0,
      startOnTick: false,
      endOnTick: false,
      lineWidth: 0,
      gridLineColor: 'transparent',
      labels: {
        enabled: false
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return CmapGeneSetSignatureResultsGraphComponent.tooltip(this.point);
      }
    },
    plotOptions: {
      series: {
        turboThreshold: 0,
        point: {
          events: {
            click: function () {
              CmapGeneSetSignatureResultsGraphComponent.click(this);
            }
          }
        },
        states: {
          inactive: {
            opacity: 1
          }
        }
      }
    },
    series: [
      {
        // Positive TAU
        name: 'Geneset',
        data: [],
        color: 'black',
        marker: {
          fillColor: 'lightgray',
          lineWidth: 2,
          lineColor: 'black'
        }
      },
      {
        // Negative TAU
        linkedTo: ':previous',
        data: [],
        marker: {}
      }
    ]
  };

  constructor(private dialog: MatDialog) {
    CmapGeneSetSignatureResultsGraphComponent.DIALOG = this.dialog;
  }

  private static convertFdr(fdr: number): number {
    return Math.abs(Math.log10(fdr));
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
  }

  public ngOnChanges(): void {
    if (this.geneSetType) {
      let marker = 'circle';
      switch (this.geneSetType) {
        case GeneSetType.UP:
          marker = 'triangle';
          this.options.series[0]['name'] = formatTitle('Geneset ' + this.geneSetType);
          break;
        case GeneSetType.DOWN:
          marker = 'triangle-down';
          this.options.series[0]['name'] = formatTitle('Geneset ' + this.geneSetType);
          break;
        case GeneSetType.GENESET:
          marker = 'square';
          this.options.series[0]['name'] = 'Geneset';
          break;
      }

      this.options.series[0]['marker']['symbol'] = marker;
      this.options.series[1]['marker']['symbol'] = marker;
    }
  }

  public ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {
        CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.clear();

        const positiveTau = data
          .filter(interaction => interaction.tau >= CmapGeneSetSignatureResultsGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            CmapGeneSetSignatureResultsGraphComponent.POSITIVE_TAU_COLOR, CmapGeneSetSignatureResultsGraphComponent.POSITIVE_TAU_MARKER_FILL_COLOR));

        const negativeTau = data
          .filter(interaction => interaction.tau <= -CmapGeneSetSignatureResultsGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            CmapGeneSetSignatureResultsGraphComponent.NEGATIVE_TAU_COLOR, CmapGeneSetSignatureResultsGraphComponent.NEGATIVE_TAU_MARKER_FILL_COLOR));

        CmapGeneSetSignatureResultsGraphComponent.pruneOverlappingInteractionsMap();

        this.options.series[0]['data'] = positiveTau;
        this.options.series[1]['data'] = negativeTau;

        Highcharts.chart('chart', this.options);
      });
  }

  private static pruneOverlappingInteractionsMap(): void {
    for (const key of Array.from(CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.keys())) {
      if (CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key).length === 1) {
        CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.delete(key);
      }
    }
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
      hchart, 90.5, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX - 0.1, 'BEST CANDIDATES')
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
      hchart, -99.5, CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX - 0.1, 'BEST CANDIDATES')
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

  private static click(point): void {
    const dialogRef = CmapGeneSetSignatureResultsGraphComponent.DIALOG.open(HtmlDialogComponent, {
      data: {
        title: 'Point detail',
        html: CmapGeneSetSignatureResultsGraphComponent.tooltip(point)
      }
    });
  }

  private static tooltip(point): string {
    let points = [point.interaction];
    const key = CmapGeneSetSignatureResultsGraphComponent.pointKey(point.x, point.y);
    if (CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.has(key)) {
      points = CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key);
    }
    return points.map(CmapGeneSetSignatureResultsGraphComponent.interactionTooltip).join('<br/>');
  }

  private static interactionTooltip(interaction: CmapGeneSetSignatureDrugInteraction): string {
    const dss = interaction.drug.dss ? interaction.drug.dss.toFixed(4) : 'NA';
    const moa = interaction.drug.moa.length > 0 ? interaction.drug.moa.join(', ') : 'NA';
    const status = CmapGeneSetSignatureResultsGraphComponent.CAPITALIZE_PIPE.transform(interaction.drug.status);

    return `
            <b>Drug</b>: ${interaction.drug.commonName} <br/>
            <b>&nbsp&nbspStatus</b>: ${status} <br/>
            <b>&nbsp&nbspMOA</b>: ${moa} <br/>
            <b>&nbsp&nbspDSS</b>: ${dss} <br/>
            <b>TAU</b>: ${interaction.tau.toFixed(4)} <br/>
            <b>FDR</b>: ${interaction.fdr.toFixed(4)} <br/>
          `;
  }

  private mapInteraction(interaction: CmapGeneSetSignatureDrugInteraction, seriesColor: string, markerFillColor: string) {
    const x = interaction.tau;
    const y = CmapGeneSetSignatureResultsGraphComponent.convertFdr(
      Math.max(
        interaction.fdr,
        CmapGeneSetSignatureResultsGraphComponent.Y_AXIS_MAX_FDR
      )
    );

    CmapGeneSetSignatureResultsGraphComponent.addToOverlappingInteractionsMap(x, y, interaction);

    return {
      x: x,
      y: y,
      interaction: interaction,
      color: seriesColor,
      marker: {
        fillColor: markerFillColor,
        lineWidth: 2,
        lineColor: seriesColor
      }
    };
  }

  private static addToOverlappingInteractionsMap(x, y, interaction): void {
    const key = CmapGeneSetSignatureResultsGraphComponent.pointKey(x, y);
    if (CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.has(key)) {
      const newArray = CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key).concat([interaction]);
      CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.set(key, newArray);
    } else {
      CmapGeneSetSignatureResultsGraphComponent.OVERLAPPING_INTERACTIONS_MAP.set(key, [interaction]);
    }
  }

  private static pointKey(x, y): string {
    return x.toString().concat(y.toString());
  }
}
