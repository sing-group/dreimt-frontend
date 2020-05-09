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

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DreimtInformationService} from '../../../../services/dreimt-information.service';
import {DreimtStatsModel} from '../../../../models/dreimt-stats.model';

class SampleLink {
  constructor(
    public readonly title: string,
    public readonly route: string,
    public readonly queryParams: { [p: string]: any }
  ) {
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public readonly SAMPLES = [
    new SampleLink(
      'Which drugs inhibit macrophages?',
      '/database',
      {cellType1: 'MACROPHAGE', cellType1Effect: 'INHIBIT'}
    ),
    new SampleLink(
      'Which drugs inhibit T cells?',
      '/database',
      {cellType1: 'T CELL', cellType1Effect: 'INHIBIT'}
    ),
    new SampleLink(
      'Which drugs boost dendritic cells?',
      '/database',
      {cellType1: 'DENDRITIC CELL', cellType1Effect: 'BOOST'}
    )
  ];

  public stats: DreimtStatsModel;

  public constructor(
    private router: Router,
    private dreimtInformationService: DreimtInformationService
  ) {
  }

  ngOnInit(): void {
    this.dreimtInformationService.getDreimtStats()
      .subscribe(stats => this.stats = stats);
  }

  public onNavigateToDatabase(): void {
    this.router.navigateByUrl('/database');
  }

  public onNavigateToDrugPrioritization(): void {
    this.router.navigateByUrl('/interactions/drug-prioritization');
  }

  public onNavigateToSignaturesComparison(): void {
    this.router.navigateByUrl('/interactions/signatures-comparison');
  }
}
