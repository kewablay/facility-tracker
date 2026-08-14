import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

const LABEL_HEIGHT = '16.5px';
const VALUE_HEIGHT = '21px';

interface SkeletonField {
  labelWidth: string;
  valueWidth: string;
}

@Component({
  selector: 'app-facility-summary-skeleton',
  imports: [SkeletonModule],
  templateUrl: './facility-summary-skeleton.html',
  styleUrl: './facility-summary-skeleton.scss',
})
export class FacilitySummarySkeleton {
  protected readonly labelHeight = LABEL_HEIGHT;
  protected readonly valueHeight = VALUE_HEIGHT;

  protected readonly fields: readonly SkeletonField[] = [
    { labelWidth: '32%', valueWidth: '74%' },
    { labelWidth: '30%', valueWidth: '56%' },
    { labelWidth: '30%', valueWidth: '62%' },
    { labelWidth: '34%', valueWidth: '46%' },
    { labelWidth: '42%', valueWidth: '38%' },
    { labelWidth: '52%', valueWidth: '82%' },
    { labelWidth: '38%', valueWidth: '52%' },
    { labelWidth: '44%', valueWidth: '58%' },
  ];
}
