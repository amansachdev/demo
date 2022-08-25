import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { ProspectTableComponent } from "./prospect-table/prospect-table.component";
import { HotTableModule } from "@handsontable/angular";
import { ProspectComponent } from "./prospect.component";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzModalModule } from "ng-zorro-antd/modal";
// import {PickerModule} from '@ctrl/ngx-emoji-mart';
import { NzRadioModule } from "ng-zorro-antd/radio";
import { FormsModule } from "@angular/forms";
import { InlineSVGModule } from "ng-inline-svg";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { ProspectRoutingModule } from "./prospect-routing.module";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { TableMenusComponent } from "./table-menus/table-menus.component";
import { SegmentFilterPipe } from "./pipes/segment-filter.pipe";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { SharedModule } from "../../shared/shared.module";
import { ClickOutsideDirective } from "./directive/click-outside.directive";
import { NzGridModule } from "ng-zorro-antd/grid";
import { TagColorDirective } from "./directive/tag-color.directive";
import { ArrayFilterPipe } from "./pipes/array-filter.pipe";
import { FroalaEditorComponent } from "./froala-editor/froala-editor.component";
import { FroalaEditorModule } from "angular-froala-wysiwyg";
import { ColumnFilterPipe } from "./pipes/column-filter.pipe";
import { HideFieldComponent } from "./table-menus/hide-field/hide-field.component";
import { NzNoAnimationModule } from "ng-zorro-antd/core/no-animation";
import { HandsOnTableComponent } from "./hands-on-table/hands-on-table.component";
import { GroupByComponent } from "./group-by/group-by.component";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { AddFilterComponent } from "./table-menus/add-filter/add-filter.component";
import { SortByComponent } from "./table-menus/sort-by/sort-by.component";
import { GroupByMenuComponent } from "./table-menus/group-by-menu/group-by-menu.component";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { HomePageComponent } from "./home-page/home-page.component";

@NgModule({
  declarations: [
    ProspectTableComponent,
    ProspectComponent,
    TableMenusComponent,
    SegmentFilterPipe,
    ClickOutsideDirective,
    TagColorDirective,
    ArrayFilterPipe,
    FroalaEditorComponent,
    ColumnFilterPipe,
    HideFieldComponent,
    HandsOnTableComponent,
    GroupByComponent,
    AddFilterComponent,
    SortByComponent,
    GroupByMenuComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    HotTableModule,
    NzDropDownModule,
    NzModalModule,
    PickerModule,
    NzRadioModule,
    FormsModule,
    InlineSVGModule,
    NzToolTipModule,
    ProspectRoutingModule,
    NzSwitchModule,
    EmojiModule,
    SharedModule,
    NzGridModule,
    FroalaEditorModule,
    NzNoAnimationModule,
    NzDatePickerModule,
    NzCollapseModule,
    NzEmptyModule
  ],
  exports: [ProspectComponent],
  providers: [DecimalPipe, ArrayFilterPipe, ColumnFilterPipe]
})
export class ProspectModule {}
