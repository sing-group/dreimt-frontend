export class CmapQueryResultsMetadata {
  public readonly maxPvalue: number;
  public readonly numPerm: number;
  public readonly upGenesCount?: number;
  public readonly upUniverseGenesCount?: number;
  public readonly downGenesCount?: number;
  public readonly downUniverseGenesCount?: number;

  public static isA(object: any): object is CmapQueryResultsMetadata {
    return object !== undefined && object !== null && object.maxPvalue !== undefined && object.numPerm !== undefined;
  }
}
