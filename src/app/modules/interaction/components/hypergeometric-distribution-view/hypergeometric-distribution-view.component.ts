import {Component, Input, OnChanges} from '@angular/core';
import {StatisticalTestsService} from '../../../shared/service/statistical-tests.service';
import {HypergeometricDataModel} from '../../../../models/hypergeometric-data.model';
import saveAs from 'file-saver';

@Component({
  selector: 'app-hypergeometric-distribution-view',
  templateUrl: './hypergeometric-distribution-view.component.html',
  styleUrls: ['./hypergeometric-distribution-view.component.scss']
})
export class HypergeometricDistributionViewComponent implements OnChanges {

  @Input() public data: Map<string, Set<string>>;
  @Input() public dataDistribution: Map<string, number>;
  @Input() public distributionName: string;

  public tabIndex: number;

  public hypergeometricDistributionData: HypergeometricDataModel[];

  constructor(private service: StatisticalTestsService) {
  }

  ngOnChanges(): void {
    if (this.data !== undefined && this.dataDistribution !== undefined) {
      this.tabIndex = 0;

      let total = 0;
      const rawData = new Map<string, number>();
      this.data.forEach((values: Set<string>, key: string) => {
        values.forEach(value => {
          if (!rawData.has(value)) {
            rawData.set(value, 0);
          }
          rawData.set(value, rawData.get(value) + 1);
          total = total + 1;
        });
      });

      const testData: HypergeometricDataModel[] = [];

      rawData.forEach((value: number, key: string) => {
        const population = this.dataDistribution['__TOTAL__'];
        const population_success = this.dataDistribution[key];
        const sample = total;
        const sample_success = value;

        testData.push({
          name: key,
          populationSize: population,
          populationSuccess: population_success,
          sampleSize: sample,
          sampleSuccess: sample_success
        });
      });

      if (testData.length > 0) {
        this.service.hypergeometricTest(testData).subscribe(results => {
          this.hypergeometricDistributionData = results;
        });
      }
    }
  }

  public downloadCsv(): void {
    if (this.hypergeometricDistributionData !== undefined) {
      const fileContents = 'name,p_value,q_value,count,odds_ratio\n' +
        this.hypergeometricDistributionData
          .map(d => {
            return `${d.name},${d.pvalue},${d.qvalue},${d.sampleSuccess},${d.oddsRatio}`;
          }).join('\n');

      const blob = new Blob([fileContents], {type: 'text/plain'});
      saveAs(blob, this.distributionName.toLowerCase().replace(' ', '_') + '_distribution.csv');
    }
  }

  public getInfoTooltip(): string {
    return `Results of enrichment analysis to test ${this.distributionName.toLowerCase()} overrepresentation (Fisher’s exact test) based ` +
      `in the thresholds applied to the results table (default FDR < 0.05).\n\n${this.distributionName}s are ordered by significance, ` +
      `colored bars are found significant at p-value < 0.05.\n\nRaw view of data can be view by clicking in the table header and ` +
      `downloaded in CSV format.`;
  }
}
