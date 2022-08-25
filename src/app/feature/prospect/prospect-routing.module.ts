import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProspectComponent} from './prospect.component';
import {ProspectTableComponent} from './prospect-table/prospect-table.component';

const routes: Routes = [
  {path: '', component: ProspectComponent},
  {path: ':segmentId/:tableId', component: ProspectTableComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProspectRoutingModule {
}
