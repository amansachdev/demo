import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {SharedModule} from './shared/shared.module';
import {NZ_WAVE_GLOBAL_CONFIG} from 'ng-zorro-antd/core/wave';
import {PickerModule} from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    PickerModule,
    NoopAnimationsModule
  ],

  providers: [{provide: NZ_I18N, useValue: en_US}, {provide: NZ_WAVE_GLOBAL_CONFIG, useValue: {disabled: true}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
