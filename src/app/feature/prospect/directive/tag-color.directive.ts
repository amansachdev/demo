import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';

const colorCode = ['#0054D1', '#0B76B7', '#06A09B', '#DA0240', '#E89500', '#D600B8', '#C53700', '#0013FF', '#338A17', '#444444'];
const backGround = ['rgba(0, 84, 209, 0.2)', 'rgba(11, 118, 183, 0.2)', 'rgba(6, 160, 155, 0.2)', 'rgba(218, 2, 64, 0.2)', 'rgba(232, 149, 0, 0.2)', 'rgba(214, 0, 184, 0.2)', 'rgba(197, 55, 0, 0.2)', 'rgba(0, 19, 255, 0.2)', 'rgba(51, 138, 23, 0.2)', 'rgba(68, 68, 68, 0.2)'];

@Directive({
  selector: '[appTagColor]'
})
export class TagColorDirective implements AfterViewInit {
  @Input() appTagColor: string;

  constructor(private rendered2: Renderer2, private element: ElementRef) {
  }


  getUniqueCode(s: string): number {
    let h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return Math.abs(h)%10;
  }

  ngAfterViewInit(): void {
    if (this.appTagColor) {
      this.setInBuiltColumnTagStyles(this.getUniqueCode(this.appTagColor));
    }
  }

  setInBuiltColumnTagStyles(uniqueNumber: number) {
    this.rendered2.setStyle(this.element.nativeElement, 'background', backGround[uniqueNumber]);
    this.rendered2.setStyle(this.element.nativeElement, 'color', colorCode[uniqueNumber]);
    this.rendered2.setStyle(this.element.nativeElement, 'border', '1px solid '+colorCode[uniqueNumber]);
    const icon = this.element.nativeElement.querySelector('path');
    if (icon) {
      this.rendered2.setAttribute(icon, 'fill', colorCode[uniqueNumber]);
    }
  }
}
