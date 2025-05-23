import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDollarWrapper]',
})
export class DollarCurrencyWrapperDirective implements OnInit {
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.renderer.addClass(this.element.nativeElement, 'dollar-wrapper');
  }
}
