import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { AbstractComponent } from '../../abstract';
import { LoaderService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent extends AbstractComponent implements OnInit {
  isLoading: boolean = true;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private loaderService: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.loaderService.loader$
      .takeUntil(this.destroyed$)
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.changeDetectorRef.detectChanges();
      });
  }
}
