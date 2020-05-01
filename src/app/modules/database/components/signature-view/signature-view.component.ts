import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SignaturesService} from '../../../interaction/services/signatures.service';
import {SignatureSummary} from '../../../../models/interactions/jaccard/signature-summary.model';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {SignatureViewDataSource} from './signature-view-data-source';
import {InteractionsService} from '../../services/interactions.service';
import {DreimtInformationService} from '../../../../services/dreimt-information.service';

@Component({
  selector: 'app-signature-view',
  templateUrl: './signature-view.component.html',
  styleUrls: ['./signature-view.component.scss']
})
export class SignatureViewComponent implements OnInit {

  private errorMessage: string;
  public minDatabaseTau: number;
  private signatureParam: string;
  private signature: SignatureSummary;
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
}
