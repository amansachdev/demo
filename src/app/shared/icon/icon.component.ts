import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit
} from '@angular/core';

const dataBaseGray = './../../../../assets/table/dataBaseGray.svg';
const dataBaseBlue = './../../../../assets/table/dataBaseBlue.svg';
const campaignGray = './../../../../assets/table/campaignGray.svg';
const campaignBlue = './../../../../assets/table/campaignBlue.svg';
const inboxGray = './../../../../assets/table/inboxGray.svg';
const inboxBlue = './../../../../assets/table/inboxBlue.svg';
const leadManagerGray = './../../../../assets/table/leadManagerGray.svg';
const leadManagerBlue = './../../../../assets/table/leadManagerBlue.svg';
const automationGray = './../../../../assets/table/automationGray.svg';
const automationBlue = './../../../../assets/table/automationBlue.svg';
const reportGray = './../../../../assets/table/reportGray.svg';
const reportBlue = './../../../../assets/table/reportBlue.svg';
const billingGray = './../../../../assets/table/billingGray.svg';
const billingBlue = './../../../../assets/table/billingBlue.svg';
const appStoreGray = './../../../../assets/table/appStoreGray.svg';
const appStoreBlue = './../../../../assets/table/appStoreBlue.svg';
const announcementGray = './../../../../assets/table/announcementGray.svg';
const announcementBlue = './../../../../assets/table/announcementBlue.svg';
const knowledgeGray = './../../../../assets/table/knowledgeGray.svg';
const knowledgeBlue = './../../../../assets/table/knowledgeBlue.svg';
const notificationGray = './../../../../assets/table/notificationGray.svg';
const notificationBlue = './../../../../assets/table/notificationBlue.svg';
const dataCenterGray = './../../../assets/table/dataCenterGray.svg';
const dataCenterBlue = './../../../../assets/table/dataCenterBlue.svg';
const dropdownIconGray = './../../../../assets/table/dropdownIconGray.svg';
const dropdownIconBlue = './../../../../assets/table/dropdownIconBlue.svg';

export const iconLibrary = {
  announcementGray,
  announcementBlue,
  knowledgeGray,
  knowledgeBlue,
  notificationGray,
  notificationBlue,
  dataCenterGray,
  dataCenterBlue,
  dataBaseGray,
  dataBaseBlue,
  campaignGray,
  campaignBlue,
  inboxGray,
  inboxBlue,
  leadManagerGray,
  leadManagerBlue,
  automationGray,
  automationBlue,
  reportGray,
  reportBlue,
  billingGray,
  billingBlue,
  appStoreGray,
  appStoreBlue,
  dropdownIconGray,
  dropdownIconBlue
};

@Component({
  selector: 'app-icon',
  template: `<img>`,
  styles: [':host::ng-deep { cursor: pointer}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {
  @Input() name;
  @Input() nameOnHover;

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    this.element.nativeElement.firstElementChild.setAttribute('src', iconLibrary[this.name]);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.element.nativeElement.firstElementChild.setAttribute('src', iconLibrary[this.name]);
  }

  @HostListener('mouseenter') onMouseOver(): void {
    if (this.nameOnHover) {
      this.element.nativeElement.firstElementChild.setAttribute('src', iconLibrary[this.nameOnHover]);
    }
  }
}
