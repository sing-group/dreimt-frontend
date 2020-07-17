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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {FieldFilterModel} from './field-filter.model';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss']
})
export class FilterFieldComponent<T> implements OnInit {
  @Input() public label: string;
  @Input() public optionLabelMapper: (string) => string;
  @Input() public debounceTime: number;
  @Input() public maxOptions: number;
  @Input() public showOptionsTooltip: boolean;
  @Input() public clearable: boolean;
  @Input() public model: FieldFilterModel<T>;

  @Output() public optionSelected: EventEmitter<string>;

  @ViewChild(MatAutocompleteTrigger, {static: false}) private autocomplete: MatAutocompleteTrigger;
  @ViewChild('filterInput', {static: false}) private filterInput: ElementRef;

  private disabled: boolean;
  private notifyNext: boolean;

  public readonly formControl: FormControl;

  private options: string[];
  public sortedOptions: string[];

  public constructor() {
    this.debounceTime = 500;
    this.maxOptions = 100;
    this.showOptionsTooltip = false;
    this.clearable = true;
    this.optionLabelMapper = value => value;
    this.disabled = false;
    this.notifyNext = false;
    this.options = [];

    this.formControl = new FormControl('');
    this.optionSelected = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.formControl.setValue(this.model.filter);
    this.formControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.model.filter = value;
        this.updateSortedOptions();

        if (this.notifyNext) {
          this.notifyNext = false;
          this.optionSelected.next(this.model.filter);
        }
      });

    this.model.filterChange.subscribe(
      filter => this.formControl.setValue(filter)
    );

    this.model.isLoading.subscribe(
      loading => loading || this.disabled ? this.formControl.disable() : this.formControl.enable()
    );

    this.model.options.subscribe(
      options => {
        this.options = options;
        this.updateSortedOptions();
      }
    );

    this.updateSortedOptions();
  }

  private updateSortedOptions(): void {
    let sortedOptions;

    if (!Boolean(this.formControl.value.trim())) {
      sortedOptions = this.options.slice(0, this.maxOptions).sort();
    } else {
      const prefix = this.formControl.value.trim().toLowerCase();

      sortedOptions = this.options
        .filter(option => option.toLowerCase().includes(prefix))
        .sort((o1, o2) => {
          o1 = o1.toLowerCase();
          o2 = o2.toLowerCase();

          const o1StartsWithPrefix = o1.startsWith(prefix);
          const o2StartsWithPrefix = o2.startsWith(prefix);

          if (o1StartsWithPrefix === o2StartsWithPrefix) {
            return o1.localeCompare(o2);
          } else {
            return o1StartsWithPrefix ? -1 : 1;
          }
        });

      if (Boolean(this.maxOptions)) {
        sortedOptions = sortedOptions.slice(0, this.maxOptions);
      }
    }

    this.sortedOptions = sortedOptions;
  }

  public clearValue($event: MouseEvent): void {
    this.notifyNext = true;
    this.formControl.setValue('');
    $event.stopPropagation(); // Prevents autocomplete trigger
    this.clearSelection();
  }

  public clearSelection(): void {
    if (this.filterInput !== undefined) {
      this.filterInput.nativeElement.blur();
    }
    if (this.autocomplete !== undefined) {
      this.autocomplete.closePanel();
    }
  }

  public enable(): void {
    if (this.disabled) {
      this.disabled = false;

      if (!this.model.loading) {
        this.formControl.enable();
      }
    }
  }

  public disable(): void {
    if (!this.disabled) {
      this.disabled = true;
      this.formControl.disable();
    }
  }

  public optionTooltip(option: string): string {
    if (this.showOptionsTooltip) {
      return this.optionLabelMapper(option);
    } else {
      return undefined;
    }
  }

  public onSelectionChanged(): void {
    this.notifyNext = true;
  }
}
