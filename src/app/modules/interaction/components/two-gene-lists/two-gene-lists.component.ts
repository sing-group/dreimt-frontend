import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GeneListComponent} from '../gene-list/gene-list.component';
import {DreimtError} from '../../../notification/entities';

@Component({
  selector: 'app-two-gene-lists',
  templateUrl: './two-gene-lists.component.html',
  styleUrls: ['./two-gene-lists.component.scss']
})
export class TwoGeneListsComponent implements OnInit {

  @Output() public readonly upGenesChanged: EventEmitter<string>;
  @Output() public readonly downGenesChanged: EventEmitter<string>;

  @Input() public upGenesInputEnabled: true;
  @Input() public downGenesInputEnabled: true;

  @ViewChild('upGenes', {static: false}) upGenesComponent: GeneListComponent;
  @ViewChild('downGenes', {static: false}) downGenesComponent: GeneListComponent;

  private fileSelection: HTMLElement;

  constructor() {
    this.upGenesChanged = new EventEmitter<string>();
    this.downGenesChanged = new EventEmitter<string>();
  }

  ngOnInit() {
    this.fileSelection = document.getElementById('file-selection');
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenesChanged.emit(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenesChanged.emit(genes);
  }

  public getInfoTooltip(): string {
    return 'Paste the genes in the boxes or use the button to import them from a file.\n\nWhen introducing genes in the boxes, you can ' +
      'introduce one gene by line or one line containing all genes separated by whitespaces or tabs.';
  }

  public importFile(): void {
    this.fileSelection.click();
  }

  private static splitLine(genes: string): string[] {
    return genes.split(/\t|,|;/)
      .map(val => val.trim());
  }

  onImportFileChange(event) {
    const files = event.srcElement.files;
    if (files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const lines = (reader.result as string)
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        const genesetNamesLine = TwoGeneListsComponent.splitLine(lines[0]);
        const firstColumnGenes = [];
        const secondColumnGenes = [];

        for (let line = 1; line < lines.length; line++) {
          const currentLine = TwoGeneListsComponent.splitLine(lines[line]);
          if (currentLine[0] !== undefined) {
            firstColumnGenes.push(currentLine[0]);
          }
          if (currentLine[1] !== undefined) {
            secondColumnGenes.push(currentLine[1]);
          }
        }

        if (secondColumnGenes.length === 0) {
          if (genesetNamesLine[0].endsWith('_DN')) {
            this.downGenesComponent.updateGenes(firstColumnGenes.join('\t'));
            this.upGenesComponent.updateGenes('');
          } else {
            this.upGenesComponent.updateGenes(firstColumnGenes.join('\t'));
            this.downGenesComponent.updateGenes('');
          }
        } else {
          this.updateGeneListComponents(
            genesetNamesLine[0], firstColumnGenes,
            genesetNamesLine[1], secondColumnGenes,
            new DreimtError(
              'Invalid genes file',
              `The selected genes file (${files[0].name}) must contain one geneset ending with '_UP' and one ending with '_DN'.`
            )
          );
        }
      };

      reader.readAsText(files[0]);
    }
  }

  private updateGeneListComponents(
    firstGenesetName: string, firstGeneset: string[],
    secondGenesetName: string, secondGeneset: string[], error: DreimtError
  ): void {
    let upGenes;
    let downGenes;
    if (firstGenesetName.endsWith('_UP') && secondGenesetName.endsWith('_DN')) {
      upGenes = firstGeneset.join('\t');
      downGenes = secondGeneset.join('\t');
    } else if (firstGenesetName.endsWith('_DN') && secondGenesetName.endsWith('_UP')) {
      downGenes = firstGeneset.join('\t');
      upGenes = secondGeneset.join('\t');
    } else {
      throw error;
    }

    this.upGenesComponent.updateGenes(upGenes);
    this.downGenesComponent.updateGenes(downGenes);
  }
}
