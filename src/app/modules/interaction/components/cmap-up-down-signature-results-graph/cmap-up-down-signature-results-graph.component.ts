/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2019 - Hugo López-Fernández,
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

import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';
import {CmapUpDownSignatureResultsDataSource} from '../cmap-up-down-signature-results-view/cmap-up-down-signature-results-data-source';
import {Subscription} from 'rxjs';

export interface DataModel {
  letter: string;
  frequency: number;
}

@Component({
  selector: 'app-cmap-up-down-signature-results-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cmap-up-down-signature-results-graph.component.html',
  styleUrls: ['./cmap-up-down-signature-results-graph.component.scss']
})
export class CmapUpDownSignatureResultsGraphComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() public dataSource: CmapUpDownSignatureResultsDataSource;

  private dataSourceSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loading = false;

  private static generateRandomSequence(min: number, max: number, length: number): number[] {
    const sequence: number[] = [];

    const randomRange = max - min + 1;
    for (let i = 0; i < length; i++) {
      sequence.push(Math.random() * randomRange + min);
    }

    return sequence;
  }

  public ngOnInit(): void {
    this.loadingSubscription = this.dataSource.loading$.subscribe(loading => this.loading = loading);
  }

  public ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.fullData$.subscribe(
      data => {

        const significantInteractions = data
          .filter(interaction => interaction.downFdr <= 0.05 || interaction.upFdr <= 0.05)
          .sort((a, b) => a.tau - b.tau);

        const significant = significantInteractions
          .map(interaction => interaction.tau);

        const notSignificantInteractions = data
          .filter(interaction => interaction.downFdr > 0.05 && interaction.upFdr > 0.05)
          .sort((a, b) => a.tau - b.tau);

        const notSignificant = notSignificantInteractions
          .map(interaction => interaction.tau);

        const rs = d3.scaleLinear()
          .domain([0, 99])
          .range([2, 10]);

        const chart = c3.generate({
          bindto: '#chart',
          point: {
            r: function (d) {
              return rs(Math.abs(d.x) * 0.9);
            }
          },
          size: {
            height: 600
          },
          data: {
            xs: {
              significant: 'significant_x',
              not_significant: 'not_significant_x'
            },
            columns: [
              ['significant_x', ...significant],
              ['significant', ...CmapUpDownSignatureResultsGraphComponent.generateRandomSequence(0, 100, significant.length)],
              ['not_significant_x', ...notSignificant],
              ['not_significant', ...CmapUpDownSignatureResultsGraphComponent.generateRandomSequence(0, 100, notSignificant.length)],
            ],
            type: 'scatter',
            colors: {
              significant: '#ff0000',
              not_significant: 'black',
            }
          },
          axis: {
            y: {
              show: false
            },
            x: {
              min: -100,
              max: 100,
              tick: {
                values: [-100, -95, -90, -75, -50, 0, 50, 75, 90, 95, 100]
              },
              label: {
                text: 'TAU',
                position: 'outer-center'
              }
            }

          },
          legend: {
            show: false
          },
          grid: {
            x: {
              lines: [
                {value: '95'},
                {value: '90'},
                {value: '75'},
                {value: '50'},
                {value: '-95'},
                {value: '-90'},
                {value: '-75'},
                {value: '-50'}
              ]
            }
          },
          tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              const $$ = this, config = $$.config,
                titleFormat = config.tooltip_format_title || defaultTitleFormat,
                nameFormat = config.tooltip_format_name || function (name) {
                  return name;
                },
                valueFormat = config.tooltip_format_value || defaultValueFormat;

              let title, text, name, i;

              for (i = 0; i < d.length; i++) {
                if (!(d[i] && (d[i].value || d[i].value === 0))) {
                  continue;
                }

                if (!text) {
                  title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                  text = '<table class=\'' + $$.CLASS.tooltip + '\'>'
                    + (title || title === 0 ? '<tr><th colspan=\'2\'>TAU: ' + title.toPrecision(4) + '</th></tr>' : '');
                }

                name = nameFormat(d[i].id);

                var tooltipArray = significantInteractions;
                if (name === 'not_significant') {
                  tooltipArray = notSignificantInteractions;
                }

                const upFdr = tooltipArray[d[i].index].upFdr.toPrecision(4);
                const downFdr = tooltipArray[d[i].index].downFdr.toPrecision(4);
                const commonName = tooltipArray[d[i].index].drug.commonName;

                text +=
                  `<tr> \
                  <td class="name">UP FDR</td> \
                  <td class="value"> ${upFdr} </td> \
                  </tr> \
                  <tr> \
                  <td class="name">DOWN FDR</td> \
                  <td class="value"> ${downFdr} </td> \
                  </tr> \
                  <tr> \
                  <td class="name">Drug</td> \
                  <td class="value"> ${commonName} </td> \
                   </tr>`;
              }
              return text + '</table>';
            }
          }
        });
      }
    );
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
}
