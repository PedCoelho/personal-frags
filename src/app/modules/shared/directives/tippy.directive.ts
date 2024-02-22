import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import tippy, { Props } from 'tippy.js';

@Directive({
  /* tslint:disable-next-line */
  selector: '[tippy]',
  standalone: true,
})
export class TippyDirective implements OnInit {
  @Input('tippyOptions') public tippyOptions: Partial<Props> = {};

  constructor(private el: ElementRef) {
    this.el = el;
  }

  public ngOnInit() {
    tippy(this.el.nativeElement, this.tippyOptions || {});
  }
}
