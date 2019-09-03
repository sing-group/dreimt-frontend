import {Component, Input} from '@angular/core';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
import {CmapUpDownSignatureResultsDataSource} from './cmap-up-down-signature-results-data-source';
import {CmapResultsService} from '../../services/cmap-results.service';

@Component({
  selector: 'app-cmap-up-down-signature-results-view',
  templateUrl: './cmap-up-down-signature-results-view.component.html',
  styleUrls: ['./cmap-up-down-signature-results-view.component.scss']
})
export class CmapUpDownSignatureResultsViewComponent {

  @Input() public metadata: CmapQueryUpDownSignatureResultsMetadata;

  public readonly dataSource: CmapUpDownSignatureResultsDataSource;

  constructor(private service: CmapResultsService) {
    this.dataSource = new CmapUpDownSignatureResultsDataSource(this.service);
  }
}
