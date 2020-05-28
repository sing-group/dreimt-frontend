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
import {MatDialog} from '@angular/material/dialog';
import {DataPolicyDialogComponent} from '../data-policy-dialog/data-policy-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

class SampleLink {
  constructor(
    public readonly title: string,
    public readonly route: string,
    public readonly order: number,
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
  public readonly samples = [
    new SampleLink(
      'Which drugs can inhibit TOX overexpression in T CD8+ cells?',
      '/database',
      3,
      {
        cellType1Effect: 'INHIBIT',
        cellType1Treatment: 'Overexpression [TOX]',
        interactionType: 'SIGNATURE',
        cellType1: 'T cell',
        cellSubType1: 'T CD8+',
        minTau: 90
      }
    ),
    new SampleLink(
      'Which drugs can inhibit macrophage M2 polarization?',
      '/database',
      1,
      {
        cellType1: 'Macrophage',
        cellSubType1: 'Macrophage M2',
        cellType2: 'Macrophage',
        cellSubType2: 'Macrophage M1',
        cellType1Effect: 'INHIBIT',
        minTau: 90
      }
    ),
    new SampleLink(
      'Which immune signatures are modulated by Vinorelbine?',
      '/database',
      2,
      {
        drugCommonName: 'vinorelbine',
        minTau: 90
      }
    ),
    new SampleLink(
      'Which drugs can inhibit colorectal cancer T-regulatory cells in humans?',
      '/database',
      5,
      {
        cellType1: 'T cell',
        cellSubType1: 'T regulatory',
        cellType1Effect: 'INHIBIT',
        disease: 'Colorectal cancer',
        organism: 'Homo sapiens',
        minTau: 90
      }
    ),
    new SampleLink(
      'Which drugs can boost anti-LIF treatment in macrophages?',
      '/database',
      4,
      {
        cellType1Effect: 'BOOST',
        cellType1Treatment: 'anti-LIF',
        cellTypeOrSubType1: 'Macrophage',
        minTau: 90
      }
    ),
    new SampleLink(
      'Which approved drugs can modulate signature expression from Hugo et al. 2016 (PubMed ID: 26997480)?',
      '/database',
      6,
      {
        drugStatus: 'APPROVED',
        disease: 'Immunotherapy',
        signaturePubMedId: 26997480,
        minTau: 90
      }
    )
  ];

  public sortSample = (a, b) => {
    return a.order - b.order;
  }

  public stats: DreimtStatsModel;
  public isSmall: boolean;

  public constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly dreimtInformationService: DreimtInformationService
  ) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => this.isSmall = result.matches);
  }

  ngOnInit(): void {
    this.dreimtInformationService.getDreimtStats()
      .subscribe(stats => this.stats = stats);
  }

  public onNavigateToDatabase(): void {
    this.router.navigateByUrl('/database');
  }

  public onNavigateToDrugPrioritization(): void {
    this.router.navigateByUrl('/query/drug-prioritization');
  }

  public onNavigateToSignaturesComparison(): void {
    this.router.navigateByUrl('/query/signatures-comparison');
  }

  onShowDataPolicy() {
    this.dialog.open(DataPolicyDialogComponent);
  }
}
