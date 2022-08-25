import { NgModule } from '@angular/core';
import {FeatureRoutingModule} from './feature-routing.module';


@NgModule({
  imports: [ FeatureRoutingModule],
  exports: [ FeatureRoutingModule ]
})
export class FeatureModule { }
