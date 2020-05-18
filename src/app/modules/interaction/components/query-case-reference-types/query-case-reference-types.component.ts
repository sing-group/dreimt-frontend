import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {FieldFilterModel} from '../../../shared/components/filter-field/field-filter.model';
import {InteractionType} from '../../../../models/interaction-type.enum';
import {formatTitle} from '../../../../utils/types';
import {FilterFieldComponent} from '../../../shared/components/filter-field/filter-field.component';

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
  public readonly queryTypeFilter: FieldFilterModel;

  @ViewChild('queryType', {static: true}) private queryTypeComponent: FilterFieldComponent;
  @ViewChild('referenceTypeComponent', {static: true}) private referenceTypeComponent;

  constructor() {
    this.caseTypeFormControl = new FormControl();
    this.caseTypeChanged = new EventEmitter<string>();
    this.referenceTypeFormControl = new FormControl();
    this.referenceTypeChanged = new EventEmitter<string>();
    this.queryTypeFilter = new FieldFilterModel();
    this.queryTypeChanged = new EventEmitter<InteractionType>();

    this.queryTypeFilter.update(Object.keys(InteractionType));
    this.queryTypeFilter.filter = InteractionType.SIGNATURE;
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

    this.queryTypeFilterChanged();
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

  public queryTypeFilterChanged(): void {
    const value = InteractionType[this.queryTypeFilter.getClearedFilter()];
    this.checkReferenceTypeStatus(value);
    this.queryTypeChanged.emit(value);
  }

  private checkReferenceTypeStatus(queryType: InteractionType): void {
    if (queryType === InteractionType.GENESET) {
      this.referenceTypeFormControl.disable();
    } else {
      this.referenceTypeFormControl.enable();
    }
  }

  public updateQueryType(queryType: InteractionType): void {
    this.queryTypeFilter.filter = queryType;
  }
}
