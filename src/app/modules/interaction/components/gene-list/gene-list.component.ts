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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-gene-list',
  templateUrl: './gene-list.component.html',
  styleUrls: ['./gene-list.component.scss']
})
export class GeneListComponent implements OnInit, OnChanges {
  private static readonly DEFAULT_VALUES = {
    rows: 8,
    debounceTime: 500,
    inputEnabled: true
  };

  @Input() public readonly title: string;
  @Input() public readonly rows: number;
  @Input() public readonly debounceTime: number;
  @Input() public readonly inputEnabled: boolean;

  @Output() public readonly genesChanged: EventEmitter<string>;

  public readonly formControl: FormControl;

  public constructor() {
    this.rows = GeneListComponent.DEFAULT_VALUES.rows;
    this.inputEnabled = GeneListComponent.DEFAULT_VALUES.inputEnabled;
    this.debounceTime = GeneListComponent.DEFAULT_VALUES.debounceTime;

    this.genesChanged = new EventEmitter<string>();

    this.formControl = new FormControl('');
  }

  public ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(this.genesChanged);
  }

  public ngOnChanges(): void {
    if (this.inputEnabled) {
      this.formControl.enable();
    } else {
      this.formControl.disable();
    }
  }

  public updateGenes(genes): void {
    this.formControl.setValue(genes);
  }
}
