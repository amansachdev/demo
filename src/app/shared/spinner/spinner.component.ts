import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<svg class="mt-3 mr-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="margin: auto; background: transparent; display: block;"><path _ngcontent-rtw-c333="" d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" fill="#ffffff" stroke="none"><animateTransform _ngcontent-rtw-c333="" attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform></path></svg>`,
  styles: []
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
