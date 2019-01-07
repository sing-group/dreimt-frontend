import {JaccardOverlapsQueryParams} from '../../../../models/interactions/jaccard/jaccard-overlaps-query-params';
import {PartialDataSource} from '../../../../utils/partial-data-source';
import {GeneOverlap} from '../../../../models/interactions/jaccard/gene-overlap.model';
import {JaccardResultsService} from '../../services/jaccard-results.service';

export class JaccardResultsDataSource extends PartialDataSource<GeneOverlap> {
  public constructor(
    private service: JaccardResultsService
  ) {
    super();
  }

  public list(resultId: string, queryParams: JaccardOverlapsQueryParams): void {
    this.update(this.service.list(resultId, queryParams));
  }
}
