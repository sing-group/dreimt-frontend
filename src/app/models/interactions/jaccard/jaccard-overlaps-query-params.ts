import {DrugSignatureInteractionField} from '../../drug-signature-interaction-field.enum';
import {SortDirection} from '../../sort-direction.enum';
import {GeneOverlapField} from './gene-overlap-field.enum';

export class JaccardOverlapsQueryParams {
  public static readonly MANIPULATION_FIELDS = ['page', 'pageSize', 'orderField', 'sortDirection'];

  public readonly page?: number;
  public readonly pageSize?: number;
  public readonly orderField?: GeneOverlapField;
  public readonly sortDirection?: SortDirection;
  public readonly maxJaccard?: number;
  public readonly maxPvalue?: number;
  public readonly maxFdr?: number;
}
