import {Component, Input} from '@angular/core';
import {CmapQueryGeneSetSignatureResultsMetadata} from '../../../../models/interactions/cmap-gene-set/cmap-query-gene-set-down-signature-results-metadata';
import {CmapGeneSetSignatureResultsDataSource} from './cmap-gene-set-signature-results-data-source';
import {CmapGeneSetResultsService} from '../../services/cmap-gene-set-results.service';

@Component({
  selector: 'app-cmap-gene-set-signature-results-view',
  templateUrl: './cmap-gene-set-signature-results-view.component.html',
  styleUrls: ['./cmap-gene-set-signature-results-view.component.scss']
})
export class CmapGeneSetSignatureResultsViewComponent {

  @Input() public metadata: CmapQueryGeneSetSignatureResultsMetadata;

  public readonly dataSource: CmapGeneSetSignatureResultsDataSource;

  constructor(private service: CmapGeneSetResultsService) {
    this.dataSource = new CmapGeneSetSignatureResultsDataSource(this.service);
  }
}
