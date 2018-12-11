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
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounce, debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss']
})
export class FilterFieldComponent implements OnInit {
  @Input() public label: string;
  @Input() public options: Observable<string[]>;
  @Input() public debounceTime: number;
  @Input() public maxOptions: number;
  @Input() public fixedValues: boolean;

  @Output() public filterChange: EventEmitter<string>;

  public readonly formControl: FormControl;

  constructor() {
    this.debounceTime = 500;
    this.maxOptions = 100;
    this.fixedValues = false;

    this.formControl = new FormControl('');
    this.filterChange = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe(value => this.filterChange.emit(value));
  }

  @Input()
  public set filter(value: string) {
    if (this.filter !== value) {
      this.formControl.setValue(value);
    }
  }

  public get filter(): string {
    return this.formControl.value;
  }

  public get sortedOptions(): Observable<string[]> {
    let mapper;

    if (this.filter === undefined || this.filter.trim() === '') {
      mapper = options => options.slice(0).sort();
    } else {
      const prefix = this.filter.trim().toLowerCase();
      mapper = options => {
        options = options.slice(0);

        options = options.sort((o1, o2) => {
          o1 = o1.toLowerCase();
          o2 = o2.toLowerCase();

          const o1StartsWithPrefix = o1.startsWith(prefix);
          const o2StartsWithPrefix = o2.startsWith(prefix);

          if (o1StartsWithPrefix === o2StartsWithPrefix) {
            return o1 === o2 ? 0 : o1 < o2 ? -1 : 1;
          } else {
            return o1StartsWithPrefix ? -1 : 1;
          }
        });

        if (this.maxOptions !== undefined) {
          options = options.slice(0, this.maxOptions);
        }

        return options;
      };
    }

    return this.options.pipe(
      map(mapper)
    );
  }

  public hasFilterValue(): boolean {
    return this.filter !== '';
  }

  public clearValue(): void {
    this.filter = '';
  }
}
