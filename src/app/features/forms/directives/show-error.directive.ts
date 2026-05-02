import {
  Directive,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appShowError]',
  standalone: true,
})
export class ShowErrorDirective implements OnInit, OnChanges, DoCheck, OnDestroy {
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private subscription?: Subscription;
  private hasView = false;

  @Input('appShowError') control: AbstractControl | null = null;
  @Input() errorType: string | null = null;

  ngOnInit(): void {
    this.subscribeToStatusChanges();
    this.updateView();
  }

  ngOnChanges(): void {
    this.subscribeToStatusChanges();
    this.updateView();
  }

  ngDoCheck(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private subscribeToStatusChanges(): void {
    this.subscription?.unsubscribe();

    if (!this.control) {
      return;
    }

    this.subscription = this.control.statusChanges.subscribe(() => {
      this.updateView();
    });
  }

  private updateView(): void {
    const shouldShow =
      !!this.control &&
      !!this.errorType &&
      !!this.control.errors?.[this.errorType] &&
      (this.control.dirty || this.control.touched);

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
