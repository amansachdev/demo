import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePageComponent} from './prospect/home-page/home-page.component';


const routes: Routes = [
  {path: 'prospect', loadChildren: () => import('./prospect/prospect.module').then(m => m.ProspectModule)},
  {path: '', component: HomePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule {
}
