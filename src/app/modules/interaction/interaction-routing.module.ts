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

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ResultsViewComponent} from './components/results-view/results-view.component';
import {CmapQueryPanelComponent} from './components/cmap-query-panel/cmap-query-panel.component';
import {JaccardQueryPanelComponent} from './components/jaccard-query-panel/jaccard-query-panel.component';
import {CmapUpDownSignatureResultsViewComponent} from './components/cmap-up-down-signature-results-view/cmap-up-down-signature-results-view.component';
import {CmapGeneSetSignatureResultsViewComponent} from './components/cmap-gene-set-signature-results-view/cmap-gene-set-signature-results-view.component';
import {JaccardResultsViewComponent} from './components/jaccard-results-view/jaccard-results-view.component';

const routes: Routes = [
  {
    path: 'drug-prioritization',
    component: CmapQueryPanelComponent
  },
  {
    path: 'drug-prioritization/results/signature/:uuid',
    component: CmapUpDownSignatureResultsViewComponent
  },
  {
    path: 'drug-prioritization/results/geneset/:uuid',
    component: CmapGeneSetSignatureResultsViewComponent
  },
  {
    path: 'signatures-comparison',
    component: JaccardQueryPanelComponent
  },
  {
    path: 'signatures-comparison/results/:uuid',
    component: JaccardResultsViewComponent
  },
  {
    path: 'calculated/:uuid',
    component: ResultsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InteractionRoutingModule {
}
