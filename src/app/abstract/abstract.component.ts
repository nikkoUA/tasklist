import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export abstract class AbstractComponent implements OnDestroy {
  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(protected changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
