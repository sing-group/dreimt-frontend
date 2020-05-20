import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GeneListComponent} from '../gene-list/gene-list.component';
import {DreimtError} from '../../../notification/entities';
import {InteractionType} from '../../../../models/interaction-type.enum';

@Component({
  selector: 'app-two-gene-lists',
  templateUrl: './two-gene-lists.component.html',
  styleUrls: ['./two-gene-lists.component.scss']
})
export class TwoGeneListsComponent implements OnInit {
  private static readonly TOOLTIP_GENE_LIST = 'When introducing genes in the boxes, you can introduce one gene by line or one line ' +
    'containing all genes separated by whitespaces or tabs.';

  @Output() public readonly upGenesChanged: EventEmitter<string>;
  @Output() public readonly downGenesChanged: EventEmitter<string>;
  @Output() public readonly queryTypeChanged: EventEmitter<InteractionType>;

  @Input() public upGenesInputEnabled: true;
  @Input() public downGenesInputEnabled: true;
  @Input() public genesTooltip: string;

  @ViewChild('upGenes', {static: false}) upGenesComponent: GeneListComponent;
  @ViewChild('downGenes', {static: false}) downGenesComponent: GeneListComponent;

  private fileSelection: HTMLElement;

  constructor() {
    this.upGenesChanged = new EventEmitter<string>();
    this.downGenesChanged = new EventEmitter<string>();
    this.queryTypeChanged = new EventEmitter<InteractionType>();
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
    return 'Paste the genes in the boxes or use the button to import them from a file.\n\n' + TwoGeneListsComponent.TOOLTIP_GENE_LIST;
  }

  public getGeneListTooltip(tooltip: string) {
    return tooltip + ' ' + this.genesTooltip + '\n\n' + TwoGeneListsComponent.TOOLTIP_GENE_LIST;
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

        if (lines.length === 0) {
          throw new DreimtError(
            'Invalid genes file',
            `The selected genes file (${files[0].name}) is empty.`
          );
        }

        const genesetNamesLine = TwoGeneListsComponent.splitLine(lines[0]);
        if (genesetNamesLine.length > 2) {
          throw new DreimtError(
            'Invalid genes file',
            `The selected genes file (${files[0].name}) contains ${genesetNamesLine.length} columns. It can contain only one or two columns.`
          );
        }

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
          if (genesetNamesLine[0].toUpperCase() === 'GENES_DN') {
            this.downGenesComponent.updateGenes(firstColumnGenes.join('\t'));
            this.upGenesComponent.updateGenes('');
            this.queryTypeChanged.emit(InteractionType.SIGNATURE_DOWN);
          } else if (genesetNamesLine[0].toUpperCase() === 'GENES_UP' || genesetNamesLine[0].toUpperCase() === 'GENES') {
            this.upGenesComponent.updateGenes(firstColumnGenes.join('\t'));
            this.downGenesComponent.updateGenes('');
            this.queryTypeChanged.emit(genesetNamesLine[0].toUpperCase() === 'GENES_UP' ? InteractionType.SIGNATURE_UP : InteractionType.GENESET);
          } else {
            throw new DreimtError(
              'Invalid genes file',
              `The selected genes file (${files[0].name}) must contain one geneset named 'Genes_UP', 'Genes_DN', or 'Genes'.`
            );
          }
        } else {
          this.updateGeneListComponents(
            genesetNamesLine[0], firstColumnGenes,
            genesetNamesLine[1], secondColumnGenes,
            new DreimtError(
              'Invalid genes file',
              `The selected genes file (${files[0].name}) must contain one geneset named 'Genes_UP' and one named 'Genes_DN'.`
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
    if (firstGenesetName.toUpperCase() === 'GENES_UP' && secondGenesetName.toUpperCase() === 'GENES_DN') {
      upGenes = firstGeneset.join('\t');
      downGenes = secondGeneset.join('\t');
    } else if (firstGenesetName.toUpperCase() === 'GENES_DN' && secondGenesetName.toUpperCase() === 'GENES_UP') {
      downGenes = firstGeneset.join('\t');
      upGenes = secondGeneset.join('\t');
    } else {
      throw error;
    }
    this.upGenesComponent.updateGenes(upGenes);
    this.downGenesComponent.updateGenes(downGenes);
    this.queryTypeChanged.emit(InteractionType.SIGNATURE);
  }
}
