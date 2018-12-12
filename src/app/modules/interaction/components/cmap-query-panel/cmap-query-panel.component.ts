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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CmapSignatureQueryParams} from '../../models/signature-query-params.model';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-cmap-query-panel',
  templateUrl: './cmap-query-panel.component.html',
  styleUrls: ['./cmap-query-panel.component.scss']
})
export class CmapQueryPanelComponent implements OnInit {
  private static readonly DEFAULT_VALUES = {
    debounceTime: 500,
    numPerm: 1000,
    maxPvalue: 0.05
  };

  @Input() public readonly debounceTime: number;

  @Output() public readonly configurationChanged: EventEmitter<CmapSignatureQueryParams>;

  public readonly formCmapQuery: FormGroup;

  public constructor(private formBuilder: FormBuilder) {
    this.debounceTime = CmapQueryPanelComponent.DEFAULT_VALUES.debounceTime;

    this.configurationChanged = new EventEmitter<CmapSignatureQueryParams>();

    this.formCmapQuery = this.formBuilder.group({
      'numPerm': [
        CmapQueryPanelComponent.DEFAULT_VALUES.numPerm,
        [Validators.required, Validators.min(1), Validators.max(1000)]
      ],
      'maxPvalue': [
        CmapQueryPanelComponent.DEFAULT_VALUES.maxPvalue,
        [Validators.required, Validators.min(0), Validators.max(1)]
      ],
    });
  }

  public ngOnInit(): void {
    this.formCmapQuery.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
    .subscribe(val => {
      if (this.formCmapQuery.valid) {
        this.configurationChanged.emit({
          numPerm: val.numPerm,
          maxPvalue: val.maxPvalue
        });
      } else {
        this.configurationChanged.emit(undefined);
      }
    });
  }
}
