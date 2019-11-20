import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-two-gene-lists',
  templateUrl: './two-gene-lists.component.html',
  styleUrls: ['./two-gene-lists.component.scss']
})
export class TwoGeneListsComponent implements OnInit {

  @Output() public readonly upGenesChanged: EventEmitter<string>;
  @Output() public readonly downGenesChanged: EventEmitter<string>;

  constructor() {
    this.upGenesChanged = new EventEmitter<string>();
    this.downGenesChanged = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenesChanged.emit(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenesChanged.emit(genes);
  }
}
