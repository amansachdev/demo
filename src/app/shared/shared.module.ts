import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar/sidebar.component';
import {IconComponent} from './icon/icon.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {InlineSVGModule} from 'ng-inline-svg';
import {RouterModule} from '@angular/router';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {UserProfileDdmComponent} from './sidebar/user-profile-ddm/user-profile-ddm.component';
import {HeaderComponent} from './sidebar/header/header.component';
import {SpinnerComponent} from './spinner/spinner.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [
    SidebarComponent,
    IconComponent,
    UserProfileDdmComponent,
    HeaderComponent,
    SpinnerComponent,
    SkeletonComponent
  ],
    exports: [
        SidebarComponent,
        IconComponent,
        HeaderComponent,
        SpinnerComponent,
        SkeletonComponent
    ],
  imports: [
    CommonModule,
    NzMenuModule,
    NzDropDownModule,
    InlineSVGModule,
    RouterModule
  ]
})
export class SharedModule {
}
