import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SignatureViewDataSource} from '../signature-view/signature-view-data-source';
import * as Highcharts from 'highcharts';
import {Subscription} from 'rxjs';
import {CmapUpDownSignatureDrugInteraction} from '../../../../models/interactions/cmap-up-down/cmap-up-down-signature-drug-interaction.model';
import {MatDialog} from '@angular/material/dialog';
import {HtmlDialogComponent} from '../../../shared/components/html-dialog/html-dialog.component';
import {DrugCellDatabaseInteraction} from '../../../../models/database/drug-cell-database-interaction.model';
import {InteractionType} from '../../../../models/interaction-type.enum';
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

export interface DataModel {
  letter: string;
  frequency: number;
}


@Component({
  selector: 'app-signature-view-graph',
  templateUrl: './signature-view-graph.component.html',
  styleUrls: ['./signature-view-graph.component.scss']
})
export class SignatureViewGraphComponent implements AfterViewInit, OnInit, OnDestroy {
  private static DIALOG: MatDialog;

  private static TAU_THRESHOLD = 85;
  private static Y_AXIS_MAX = 3.1;
  private static Y_AXIS_MAX_FDR = 0.001;
  private static renderedObjects = [];
  private static OVERLAPPING_INTERACTIONS_MAP = new Map();
  private static POSITIVE_TAU_COLOR = 'red';
  private static POSITIVE_TAU_MARKER_FILL_COLOR = '#FF9994';
  private static NEGATIVE_TAU_COLOR = 'green';
  private static NEGATIVE_TAU_MARKER_FILL_COLOR = 'lightgreen';

  private static CAPITALIZE_PIPE = new CapitalizePipe();

  @Input() public dataSource: SignatureViewDataSource;

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
          SignatureViewGraphComponent.addDecorations(this);
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
      verticalAlign: 'top'
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
              SignatureViewGraphComponent.addDecorations(this);
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
        from: -SignatureViewGraphComponent.TAU_THRESHOLD,
        to: SignatureViewGraphComponent.TAU_THRESHOLD,
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
          value: SignatureViewGraphComponent.TAU_THRESHOLD,
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
      max: SignatureViewGraphComponent.Y_AXIS_MAX,
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
        return SignatureViewGraphComponent.tooltip(this.point);
      }
    },
    plotOptions: {
      series: {
        turboThreshold: 0,
        point: {
          events: {
            click: function () {
              SignatureViewGraphComponent.click(this);
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
        // Positive TAU (Signagure)
        name: 'Signature',
        data: [],
        color: 'black',
        marker: {
          symbol: 'circle',
          fillColor: 'lightgray',
          lineWidth: 2,
          lineColor: 'black'
        }
      },
      {
        // Negative TAU (Signature)
        linkedTo: ':previous',
        data: [],
        marker: {
          symbol: 'circle'
        }
      },
      {
        // Positive TAU (Up)
        name: 'Signature up',
        data: [],
        color: 'black',
        marker: {
          symbol: 'triangle',
          fillColor: 'lightgray',
          lineWidth: 2,
          lineColor: 'black'
        }
      },
      {
        // Negative TAU (Up)
        linkedTo: ':previous',
        data: [],
        marker: {
          symbol: 'triangle'
        }
      },
      {
        // Positive TAU (Down)
        name: 'Signature down',
        data: [],
        color: 'black',
        marker: {
          symbol: 'triangle-down',
          fillColor: 'lightgray',
          lineWidth: 2,
          lineColor: 'black'
        }
      },
      {
        // Negative TAU (Down)
        linkedTo: ':previous',
        data: [],
        marker: {
          symbol: 'triangle-down'
        }
      },
      {
        // Positive TAU (Geneset)
        name: 'Geneset',
        data: [],
        color: 'black',
        marker: {
          symbol: 'square',
          fillColor: 'lightgray',
          lineWidth: 2,
          lineColor: 'black'
        }
      },
      {
        // Negative TAU (Geneset)
        linkedTo: ':previous',
        data: [],
        marker: {
          symbol: 'square'
        }
      }
    ]
  };

  constructor(private dialog: MatDialog) {
    SignatureViewGraphComponent.DIALOG = this.dialog;
  }

  private static convertFdr(fdr: number): number {
    return Math.abs(Math.log10(fdr));
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
  }

  public ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {
        SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.clear();

        const positiveTauBoth = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE)
          .filter(interaction => interaction.tau >= SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.POSITIVE_TAU_COLOR, SignatureViewGraphComponent.POSITIVE_TAU_MARKER_FILL_COLOR));

        const negativeTauBoth = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE)
          .filter(interaction => interaction.tau <= -SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.NEGATIVE_TAU_COLOR, SignatureViewGraphComponent.NEGATIVE_TAU_MARKER_FILL_COLOR));

        const positiveTauUp = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE_UP)
          .filter(interaction => interaction.tau >= SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.POSITIVE_TAU_COLOR, SignatureViewGraphComponent.POSITIVE_TAU_MARKER_FILL_COLOR));

        const negativeTauUp = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE_UP)
          .filter(interaction => interaction.tau <= -SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.NEGATIVE_TAU_COLOR, SignatureViewGraphComponent.NEGATIVE_TAU_MARKER_FILL_COLOR));

        const positiveTauDown = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE_DOWN)
          .filter(interaction => interaction.tau >= SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.POSITIVE_TAU_COLOR, SignatureViewGraphComponent.POSITIVE_TAU_MARKER_FILL_COLOR));

        const negativeTauDown = data
          .filter(interaction => interaction.interactionType === InteractionType.SIGNATURE_DOWN)
          .filter(interaction => interaction.tau <= -SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.NEGATIVE_TAU_COLOR, SignatureViewGraphComponent.NEGATIVE_TAU_MARKER_FILL_COLOR));

        const positiveTauGeneset = data
          .filter(interaction => interaction.interactionType === InteractionType.GENESET)
          .filter(interaction => interaction.tau >= SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.POSITIVE_TAU_COLOR, SignatureViewGraphComponent.POSITIVE_TAU_MARKER_FILL_COLOR));

        const negativeTauGeneset = data
          .filter(interaction => interaction.interactionType === InteractionType.GENESET)
          .filter(interaction => interaction.tau <= -SignatureViewGraphComponent.TAU_THRESHOLD)
          .map(interaction => this.mapInteraction(interaction,
            SignatureViewGraphComponent.NEGATIVE_TAU_COLOR, SignatureViewGraphComponent.NEGATIVE_TAU_MARKER_FILL_COLOR));

        SignatureViewGraphComponent.pruneOverlappingInteractionsMap();

        this.options.series[0]['data'] = positiveTauBoth;
        this.options.series[1]['data'] = negativeTauBoth;
        this.options.series[2]['data'] = positiveTauUp;
        this.options.series[3]['data'] = negativeTauUp;
        this.options.series[4]['data'] = positiveTauDown;
        this.options.series[5]['data'] = negativeTauDown;
        this.options.series[6]['data'] = positiveTauGeneset;
        this.options.series[7]['data'] = negativeTauGeneset;

        this.options.series[0]['showInLegend'] = positiveTauBoth.length > 0 || negativeTauBoth.length > 0;
        this.options.series[2]['showInLegend'] = positiveTauUp.length > 0 || negativeTauUp.length > 0;
        this.options.series[4]['showInLegend'] = positiveTauDown.length > 0 || negativeTauDown.length > 0;
        this.options.series[6]['showInLegend'] = positiveTauGeneset.length > 0 || negativeTauGeneset.length > 0;

        Highcharts.chart('chart', this.options);
      });
  }

  private static pruneOverlappingInteractionsMap(): void {
    for (const key of Array.from(SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.keys())) {
      if (SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key).length === 1) {
        SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.delete(key);
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
    let fromY = Math.min(maxVisibleY, SignatureViewGraphComponent.Y_AXIS_MAX);
    let toY = Math.max(minVisibleY, SignatureViewGraphComponent.convertFdr(0.05));
    this.renderedObjects.push(SignatureViewGraphComponent.drawRectFromCoordinates(
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

    this.renderedObjects.push(SignatureViewGraphComponent.drawText(
      hchart, 90.5, SignatureViewGraphComponent.Y_AXIS_MAX - 0.1, 'BEST CANDIDATES')
      .css({color: 'red', fontWeight: 'bold', opacity: 0.5})
      .add());

    this.renderedObjects.push(SignatureViewGraphComponent.drawText(
      hchart, 90.5, SignatureViewGraphComponent.convertFdr(0.06), 'GOOD CANDIDATES')
      .css({color: 'red', fontWeight: 'bold', opacity: 0.5})
      .add());

    // Upper-left red rectangle for best candidates with negative TAU
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(-90, maxVisibleX);
    fromY = Math.min(maxVisibleY, SignatureViewGraphComponent.Y_AXIS_MAX);
    toY = Math.max(minVisibleY, SignatureViewGraphComponent.convertFdr(0.05));
    this.renderedObjects.push(SignatureViewGraphComponent.drawRectFromCoordinates(
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

    this.renderedObjects.push(SignatureViewGraphComponent.drawText(
      hchart, -99.5, SignatureViewGraphComponent.Y_AXIS_MAX - 0.1, 'BEST CANDIDATES')
      .css({color: 'green', fontWeight: 'bold', opacity: 0.5})
      .add());

    this.renderedObjects.push(SignatureViewGraphComponent.drawText(
      hchart, -99.5, SignatureViewGraphComponent.convertFdr(0.06), 'GOOD CANDIDATES')
      .css({color: 'green', fontWeight: 'bold', opacity: 0.5})
      .add());

    // Horizontal line to separate interactions at FDR = 0.05
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(100, maxVisibleX);
    if (SignatureViewGraphComponent.convertFdr(0.05) > minVisibleY) {
      this.renderedObjects.push(SignatureViewGraphComponent.drawPath(
        hchart,
        fromX,
        SignatureViewGraphComponent.convertFdr(0.05),
        toX,
        SignatureViewGraphComponent.convertFdr(0.05)
      ).attr({
        'stroke-width': 1,
        dashstyle: 'ShortDash',
        stroke: '#888'
      }).add());
    }

    // Horizontal line at the X axis for positive TAU interactions
    fromX = Math.max(SignatureViewGraphComponent.TAU_THRESHOLD, minVisibleX);
    toX = Math.min(100, maxVisibleX);
    if (fromX <= toX) {
      this.renderedObjects.push(SignatureViewGraphComponent.drawPath(hchart, fromX, minVisibleY, toX, minVisibleY).attr({
        'stroke-width': 5,
        stroke: '#FF7F7F'
      }).add());
    }

    // Horizontal line at the X axis for negative TAU interactions
    fromX = Math.max(-100, minVisibleX);
    toX = Math.min(SignatureViewGraphComponent.TAU_THRESHOLD, maxVisibleX);
    if (fromX <= toX) {
      this.renderedObjects.push(SignatureViewGraphComponent.drawPath(hchart, fromX, minVisibleY, toX, minVisibleY).attr({
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
      SignatureViewGraphComponent.toXPixel(hchart, atX),
      SignatureViewGraphComponent.toYPixel(hchart, atY)
    );
  }

  private static drawRectFromCoordinates(hchart, fromX, fromY, toX, toY, radius) {
    return hchart.renderer.rect(
      SignatureViewGraphComponent.toXPixel(hchart, fromX),
      SignatureViewGraphComponent.toYPixel(hchart, fromY),
      SignatureViewGraphComponent.toXPixel(hchart, toX) - SignatureViewGraphComponent.toXPixel(hchart, fromX),
      SignatureViewGraphComponent.toYPixel(hchart, toY) - SignatureViewGraphComponent.toYPixel(hchart, fromY),
      radius
    );
  }

  private static drawPath(hchart, fromX, fromY, toX, toY) {
    return hchart.renderer.path([
      'M',
      SignatureViewGraphComponent.toXPixel(hchart, fromX),
      SignatureViewGraphComponent.toYPixel(hchart, fromY),
      'L',
      SignatureViewGraphComponent.toXPixel(hchart, toX),
      SignatureViewGraphComponent.toYPixel(hchart, toY)
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
    const dialogRef = SignatureViewGraphComponent.DIALOG.open(HtmlDialogComponent, {
      data: {
        title: 'Point detail',
        html: SignatureViewGraphComponent.tooltip(point)
      }
    });
  }

  private static tooltip(point): string {
    let points = [point.interaction];
    const key = SignatureViewGraphComponent.pointKey(point.x, point.y);
    if (SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.has(key)) {
      points = SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key);
    }
    return points.map(SignatureViewGraphComponent.interactionTooltip).join('<br/>');
  }

  private static interactionTooltip(interaction: CmapUpDownSignatureDrugInteraction): string {
    const dss = interaction.drug.dss ? interaction.drug.dss.toFixed(4) : 'NA';
    const moa = interaction.drug.moa.length > 0 ? interaction.drug.moa.join(', ') : 'NA';
    const status = SignatureViewGraphComponent.CAPITALIZE_PIPE.transform(interaction.drug.status);

    let tooltip = `
            <b>Drug</b>: ${interaction.drug.commonName} <br/>
            <b>&nbsp&nbspStatus</b>: ${status} <br/>
            <b>&nbsp&nbspMOA</b>: ${moa} <br/>
            <b>&nbsp&nbspDSS</b>: ${dss} <br/>
            <b>TAU</b>: ${interaction.tau.toFixed(4)} <br/>`;

    if (interaction.upFdr !== null) {
      tooltip = tooltip.concat(`<b>Up Genes FDR</b>: ${interaction.upFdr.toFixed(4)} <br/>`);
    }
    if (interaction.downFdr !== null) {
      tooltip = tooltip.concat(`<b>Down Genes FDR</b>: ${interaction.downFdr.toFixed(4)} <br/>`);
    }
    return tooltip;
  }

  private mapInteraction(interaction: DrugCellDatabaseInteraction, seriesColor: string, markerFillColor: string) {
    let interactionFdr: number;
    if (interaction.upFdr === null) {
      interactionFdr = interaction.downFdr;
    } else if (interaction.downFdr === null) {
      interactionFdr = interaction.upFdr;
    } else {
      interactionFdr = Math.min(interaction.upFdr, interaction.downFdr);
    }

    const x = interaction.tau;
    const y = SignatureViewGraphComponent.convertFdr(
      Math.max(
        interactionFdr,
        SignatureViewGraphComponent.Y_AXIS_MAX_FDR
      )
    );

    SignatureViewGraphComponent.addToOverlappingInteractionsMap(x, y, interaction);

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
    const key = SignatureViewGraphComponent.pointKey(x, y);
    if (SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.has(key)) {
      const newArray = SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.get(key).concat([interaction]);
      SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.set(key, newArray);
    } else {
      SignatureViewGraphComponent.OVERLAPPING_INTERACTIONS_MAP.set(key, [interaction]);
    }
  }

  private static pointKey(x, y): string {
    return x.toString().concat(y.toString());
  }
}
