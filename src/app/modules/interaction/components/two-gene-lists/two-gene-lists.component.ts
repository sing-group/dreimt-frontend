import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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

  @ViewChild('upGenes') upGenesComponent: GeneListComponent;
  @ViewChild('downGenes') downGenesComponent: GeneListComponent;

  private gmtSelection: HTMLElement;
  private gmxSelection: HTMLElement;

  constructor() {
    this.upGenesChanged = new EventEmitter<string>();
    this.downGenesChanged = new EventEmitter<string>();
  }

  ngOnInit() {
    this.gmtSelection = document.getElementById('gmt-selection');
    this.gmxSelection = document.getElementById('gmx-selection');
  }

  public onUpGenesChanged(genes: string): void {
    this.upGenesChanged.emit(genes);
  }

  public onDownGenesChanged(genes: string): void {
    this.downGenesChanged.emit(genes);
  }

  public getInfoTooltip(): string {
    return 'Paste the genes in the boxes or use the buttons to import them.\n\nWhen introducing genes in the boxes, you can introduce one gene by line or one line containing all genes separated by whitespaces or tabs.';
  }

  public importGmtFile(): void {
    this.gmtSelection.click();
  }

  public importGmxFile(): void {
    this.gmxSelection.click();
  }

  onGmtChange(event) {
    const files = event.srcElement.files;
    if (files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const lines = (reader.result as string)
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        if (lines.length < 1 || lines.length > 2) {
          throw new DreimtError(
            'Invalid GMT file',
            `The selected GMT file (${files[0].name}) is invalid. It must be a GMT formated file containing one or two lines.`
          );
        } else {
          const firstLine = TwoGeneListsComponent.splitTsvLine(lines[0]);
          const firstLineName = firstLine[0];

          if (lines.length === 1) {
            this.upGenesComponent.updateGenes(firstLine.slice(2, firstLine.length).join('\t'));
            this.downGenesComponent.updateGenes('');
          } else {
            const secondLine = TwoGeneListsComponent.splitTsvLine(lines[1]);
            const secondLineName = secondLine[0];

            this.updateGeneListComponents(
              firstLineName, firstLine.slice(2, firstLine.length),
              secondLineName, secondLine.slice(2, firstLine.length),
              new DreimtError(
                'Invalid GMT file',
                `The selected GMT file (${files[0].name}) must contain one geneset ending with '_UP' and one ending with '_DN'.`
              )
            );
          }
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

  private static splitTsvLine(genes: string): string[] {
    return genes.split('\t')
      .map(val => val.trim());
  }

  onGmxChange(event) {
    const files = event.srcElement.files;
    if (files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const lines = (reader.result as string)
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        if (lines.length < 3) {
          throw new DreimtError(
            'Invalid GMX file',
            `The selected GMX file (${files[0].name}) is invalid. It must be a GMX formated file.`
          );
        } else {
          const genesetNamesLine = TwoGeneListsComponent.splitTsvLine(lines[0]);
          const firstColumnGenes = [];
          const secondColumnGenes = [];

          for (let line = 2; line < lines.length; line++) {
            const currentLine = TwoGeneListsComponent.splitTsvLine(lines[line]);
            if (currentLine[0] !== undefined) {
              firstColumnGenes.push(currentLine[0]);
            }
            if (currentLine[1] !== undefined) {
              secondColumnGenes.push(currentLine[1]);
            }
          }

          if (secondColumnGenes.length === 0) {
            this.upGenesComponent.updateGenes(firstColumnGenes.join('\t'));
            this.downGenesComponent.updateGenes('');
          } else {
            this.updateGeneListComponents(
              genesetNamesLine[0], firstColumnGenes,
              genesetNamesLine[1], secondColumnGenes,
              new DreimtError(
                'Invalid GMX file',
                `The selected GMX file (${files[0].name}) must contain one geneset ending with '_UP' and one ending with '_DN'.`
              )
            );
          }
        }
      };

      reader.readAsText(files[0]);
    }
  }
}
