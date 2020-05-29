import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SignaturesService} from '../../../interaction/services/signatures.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {SignatureViewDataSource} from './signature-view-data-source';
import {InteractionsService} from '../../services/interactions.service';
import {DreimtInformationService} from '../../../../services/dreimt-information.service';
import {CellSignature} from '../../../../models/database/cell-signature.model';

@Component({
  selector: 'app-signature-view',
  templateUrl: './signature-view.component.html',
  styleUrls: ['./signature-view.component.scss']
})
export class SignatureViewComponent implements OnInit {

  private errorMessage: string;
  public minDatabaseTau: number;
  private signatureParam: string;
  private signature: CellSignature;
  public readonly dataSource: SignatureViewDataSource;

  constructor(
    private route: ActivatedRoute,
    private signatureService: SignaturesService,
    private interactionsService: InteractionsService,
    private dreimtInformationService: DreimtInformationService
  ) {
    this.dataSource = new SignatureViewDataSource(this.interactionsService);
  }

  ngOnInit() {
    this.dreimtInformationService.getDreimtInformation().subscribe(info => this.minDatabaseTau = info.tauThreshold);

    const signatureParam = this.route.snapshot.queryParamMap.get('signature');
    if (signatureParam) {
      this.signatureParam = signatureParam;
      this.getSignature();
    } else {
      this.errorMessage = 'No signature selected';
    }
  }

  private getSignature(): void {
    this.signatureService
      .getSignatureSummary(this.signatureParam)
      .pipe(
        catchError(
          (error: Error) => {
            this.errorMessage = 'Error loading signature ' + this.signatureParam;
            return throwError(error);
          }
        ))
      .subscribe(signature => this.signature = signature);
  }

  public isLoading(): boolean {
    return this.signature === undefined && !this.isError();
  }

  public isLoaded(): boolean {
    return this.signature !== undefined;
  }

  public isError(): boolean {
    return this.errorMessage !== undefined;
  }

  public getTitleInfoTooltip(): string {
    return 'Signature: Gene list rank-ordered according to their differential expression, immune cells relative to control. Signatures ' +
      'can be composed of either one or both of the follwing genesets:\n\n' +
      '   - Signature up: geneset composed of the topmost signature upregulated genes.\n\n' +
      '   - Signature down: geneset composed of the topmost signature downregulated genes.\n\n' +
      '   - Geneset: group of genes representing an immune cell without specified control (e.g. macrophage core genes).';
  }
}
