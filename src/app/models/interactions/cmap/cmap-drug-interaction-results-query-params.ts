import {GeneOverlapField} from '../jaccard/gene-overlap-field.enum';
import {SortDirection} from '../../sort-direction.enum';

export class CmapDrugInteractionResultsQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection', 'resultId'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: GeneOverlapField;
  public readonly sortDirection?: SortDirection;
  public readonly maxPvalue?: number;
  public readonly minTes?: number;
  public readonly maxTes?: number;
  public readonly maxFdr?: number;
  public readonly drugSourceName?: string;
  public readonly drugSourceDb?: string;
  public readonly drugCommonName?: string;
}
