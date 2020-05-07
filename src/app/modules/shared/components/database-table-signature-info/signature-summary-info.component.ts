import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {SignatureSummary} from '../../../../models/interactions/jaccard/signature-summary.model';

@Component({
  selector: 'app-signature-summary-info',
  templateUrl: './signature-summary-info.component.html',
  styleUrls: ['./signature-summary-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignatureSummaryInfoComponent {

  @Input() signature: SignatureSummary;

  constructor(private router: Router) {
  }

  public signatureNameTooltip(): string {
    let tooltip = 'Signature: ' + this.signature.signatureName;
    tooltip = tooltip + '\nSignature Source DB: ' + this.signature.sourceDb;
    if (this.signature.articleTitle) {
      tooltip = tooltip + '\nArticle title: ' + this.signature.articleTitle;
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
