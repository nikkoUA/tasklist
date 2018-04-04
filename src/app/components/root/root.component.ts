import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AbstractComponent } from '../../abstract';
import { LoaderService } from '../../services';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent extends AbstractComponent implements OnInit {
  isLoading: boolean = true;

  constructor(changeDetectorRef: ChangeDetectorRef,
              private loaderService: LoaderService) {
    super(changeDetectorRef);
  }

  ngOnInit(): void {
    this.loaderService.loader$
      .takeUntil(this.destroyed$)
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);
  }
}
