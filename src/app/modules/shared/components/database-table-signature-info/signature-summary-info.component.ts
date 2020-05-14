import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {SignatureSummary} from '../../../../models/interactions/jaccard/signature-summary.model';
import {CellSignature} from '../../../../models/database/cell-signature.model';

@Component({
  selector: 'app-signature-summary-info',
  templateUrl: './signature-summary-info.component.html',
  styleUrls: ['./signature-summary-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignatureSummaryInfoComponent {

  @Input() signature: SignatureSummary | CellSignature;

  constructor(private router: Router) {
  }

  public signatureNameTooltip(): string {
    let tooltip = 'Signature: ' + this.signature.signatureName;
    tooltip = tooltip + '\nSignature Source DB: ' + this.signature.sourceDb;

    if (CellSignature.isA(this.signature)) {
      if (this.signature.disease && this.signature.disease.length > 0) {
        tooltip = tooltip + '\nCondition: ' + this.signature.treatmentA;
      }
      if (this.signature.treatmentA.length > 0) {
        tooltip = tooltip + '\nCase treatment: ' + this.signature.treatmentA;
      }
      if (this.signature.treatmentB.length > 0) {
        tooltip = tooltip + '\nReference treatment: ' + this.signature.treatmentB;
      }
      if (this.signature.diseaseA.length > 0) {
        tooltip = tooltip + '\nCase condition: ' + this.signature.diseaseA;
      }
      if (this.signature.diseaseB.length > 0) {
        tooltip = tooltip + '\nReference condition: ' + this.signature.diseaseB;
      }
      if (this.signature.stateA) {
        tooltip = tooltip + '\nCase state: ' + this.signature.stateA;
      }
      if (this.signature.stateB) {
        tooltip = tooltip + '\nReference state: ' + this.signature.stateB;
      }
    }

    if (this.signature.articleTitle) {
      tooltip = tooltip + '\nArticle geneListTitle: ' + this.signature.articleTitle;
    }

    if (this.signature.articleAuthors) {
      let articleAuthors = '';
      if (this.signature.articleAuthors.indexOf(',') !== -1) {
        articleAuthors = this.signature.articleAuthors.substring(0, this.signature.articleAuthors.indexOf(',')) + ' et al.';
      } else {
        articleAuthors = this.signature.articleAuthors;
      }
      tooltip = tooltip + '\nArticle authors: ' + articleAuthors;
    }

    if (this.signature.articlePubMedId) {
      tooltip = tooltip + '\nPubMed ID: ' + this.signature.articlePubMedId;
    }

    return tooltip;
  }

  public navigateToSignature(): void {
    this.router.navigate(['/database/signature'], {queryParams: {signature: this.signature.signatureName}});
  }
}
