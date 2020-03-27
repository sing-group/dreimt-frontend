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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent implements OnInit {
  @Input() public initialValue: number;
  @Input() public step: string;
  @Input() public max: string;
  @Input() public min: string;
  @Input() public label: string;
  @Input() public debounceTime: number;
  @Input() public clearable: boolean;

  @Output() public valueChange: EventEmitter<number>;

  public readonly formControl: FormControl;

  constructor() {
    this.clearable = true;
    this.formControl = new FormControl('');
    this.valueChange = new EventEmitter<number>();
  }

  public ngOnInit(): void {
    if (this.initialValue !== undefined) {
      this.formControl.setValue(this.initialValue);
    }
    this.formControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (this.isValidValue(value)) {
          this.valueChange.emit(value);
        }
      });
  }

  public hasValue(): boolean {
    return this.formControl.value !== null;
  }

  public setValue(value): void {
    this.formControl.setValue(value);
  }

  public clearValue(): void {
    this.formControl.setValue(null);
  }

  public getMatInputWrapperClass(): string {
    if (this.hasValue()) {
      if (this.isValidValue(this.formControl.value)) {
        return 'mat-input-wrapper';
      } else {
        return 'mat-input-wrapper invalid-value';
      }
    } else {
      return 'mat-input-wrapper';
    }
  }

  private isValidValue(value): boolean {
    return value >= this.min && value <= this.max;
  }
}
