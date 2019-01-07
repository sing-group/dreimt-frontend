import {PartialDataSource} from '../../../../utils/partial-data-source';
import {CmapDrugInteraction} from '../../../../models/interactions/cmap/cmap-drug-interaction.model';
import {CmapDrugInteractionResultsQueryParams} from '../../../../models/interactions/cmap/cmap-drug-interaction-results-query-params';
import {CmapResultsService} from '../../services/cmap-results.service';

export class CmapResultsDataSource extends PartialDataSource<CmapDrugInteraction> {
  public constructor(
    private service: CmapResultsService
  ) {
    super();
  }

  public list(resultId: string, queryParams: CmapDrugInteractionResultsQueryParams): void {
    this.update(this.service.list(resultId, queryParams));
  }
}
