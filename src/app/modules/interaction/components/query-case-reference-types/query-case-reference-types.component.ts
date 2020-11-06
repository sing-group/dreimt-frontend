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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {formatTitle} from '../../../../utils/types';
import {FilterFieldComponent} from '../../../shared/components/filter-field/filter-field.component';
import {of} from 'rxjs';

@Component({
  selector: 'app-query-case-reference-types',
  templateUrl: './query-case-reference-types.component.html',
  styleUrls: ['./query-case-reference-types.component.scss']
})
export class QueryCaseReferenceTypesComponent implements OnInit {

  @Input() public debounceTime: number;

  @Output() public readonly caseTypeChanged: EventEmitter<string>;
  @Output() public readonly referenceTypeChanged: EventEmitter<string>;
  @Output() public readonly queryTypeChanged: EventEmitter<InteractionType>;

  public readonly caseTypeFormControl: FormControl;
  public readonly referenceTypeFormControl: FormControl;
  public readonly queryTypeFormControl: FormControl;

  @ViewChild('queryType', {static: true}) private queryTypeComponent: FilterFieldComponent<string>;
  @ViewChild('referenceTypeComponent', {static: true}) private referenceTypeComponent;

  constructor() {
    this.caseTypeFormControl = new FormControl();
    this.caseTypeChanged = new EventEmitter<string>();
    this.referenceTypeFormControl = new FormControl();
    this.referenceTypeChanged = new EventEmitter<string>();
    this.queryTypeFormControl = new FormControl();
    this.queryTypeChanged = new EventEmitter<InteractionType>();
  }

  ngOnInit(): void {

    this.caseTypeFormControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.caseTypeChanged.emit(value);
      });

    this.referenceTypeFormControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.referenceTypeChanged.emit(value);
      });

    this.queryTypeFormControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const interactionType = InteractionType[value];
        this.checkReferenceTypeStatus(interactionType);
        this.queryTypeChanged.emit(interactionType);
      });

    this.queryTypeFormControl.setValue(InteractionType.SIGNATURE);
  }

  public getInteractionTypes(): string[] {
    return Object.keys(InteractionType);
  }

  public getInfoTooltip(): string {
    return 'Brief description of the immune gene expression signature case and reference cells.';
  }

  public mapQueryType(interactionType: string): string {
    return formatTitle(interactionType);
  }

  public getQueryFilterTypeTooltip(): string {
    return 'Specify the input type:\n\t- Signature (upregulated and downregulated genes)\n\t-Signature up (only upregulated genes)' +
      '\n\t-Signature down (downregulated genes)\n\t-Geneset (gene list without specified direction).';
  }

  private checkReferenceTypeStatus(queryType: InteractionType): void {
    if (queryType === InteractionType.GENESET) {
      this.referenceTypeFormControl.disable();
    } else {
      this.referenceTypeFormControl.enable();
    }
  }

  public updateQueryType(queryType: InteractionType): void {
    this.queryTypeFormControl.setValue(queryType);
  }
}
