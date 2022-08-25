import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './feature/prospect/home-page/home-page.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
