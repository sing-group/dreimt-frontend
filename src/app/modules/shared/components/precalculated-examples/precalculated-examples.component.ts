import {Component, Input} from '@angular/core';
import {PrecalculatedExample} from '../../../../models/interactions/precalculated-example.model';
import {Work} from '../../../../models/work/work.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-precalculated-examples',
  templateUrl: './precalculated-examples.component.html',
  styleUrls: ['./precalculated-examples.component.scss']
})
export class PrecalculatedExamplesComponent {

  @Input() public examples: PrecalculatedExample[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public loadPrecalculatedExample(example: PrecalculatedExample) {
    this.navigateToWork(example.workData);
  }

  private navigateToWork(work: Work): void {
    this.router.navigate(['../calculated', work.id.id], {relativeTo: this.activatedRoute});
  }
}
