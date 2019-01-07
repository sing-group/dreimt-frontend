import {ExperimentalDesign} from '../../experimental-design.enum';

export class JaccardQueryResultMetadata {
  public readonly onlyUniverseGenes: boolean;
  public readonly cellTypeA?: string;
  public readonly cellSubTypeA?: string;
  public readonly cellTypeB?: string;
  public readonly cellSubTypeB?: string;
  public readonly experimentalDesign?: ExperimentalDesign;
  public readonly organism?: string;
  public readonly disease?: string;
  public readonly signatureSourceDb?: string;
  public readonly upGenesCount?: number;
  public readonly upUniverseGenesCount?: number;
  public readonly downGenesCount?: number;
  public readonly downUniverseGenesCount?: number;

  public static isA(object: any): object is JaccardQueryResultMetadata {
    return object !== undefined && object !== null && object.onlyUniverseGenes !== undefined;
  }
}
