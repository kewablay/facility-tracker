import { Component, computed, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-facility-table-skeleton',
  imports: [SkeletonModule],
  templateUrl: './facility-table-skeleton.html',
  styleUrl: './facility-table-skeleton.scss',
})
export class FacilityTableSkeleton {
  readonly rowCount = input(10);

  protected readonly columns = ['26%', '14%', '18%', '14%', '16%'];
  protected readonly rows = computed(() => Array.from({ length: this.rowCount() }, (_, i) => i));
}
