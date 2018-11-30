/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018 - Hugo López-Fernández,
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
import {DrugCellInteractionsService} from '../../services/drug-cell-interactions.service';
import {DrugCellInteractionModel} from '../../models/drug-cell-interaction.model';

@Component({
  selector: 'app-drug-cell-interactions-table',
  templateUrl: './drug-cell-interactions-table.component.html',
  styleUrls: ['./drug-cell-interactions-table.component.scss']
})
export class DrugCellInteractionsTableComponent implements OnInit {
  public interactions: DrugCellInteractionModel[];

  public displayedColumns: string[];

  constructor(
    private interactionsService: DrugCellInteractionsService
  ) {
  }

  ngOnInit() {
    this.displayedColumns = ['drugName', 'cellTypeA', 'cellTypeB'];

    this.interactionsService.list()
      .subscribe(interactions => this.interactions = interactions);
  }

}
