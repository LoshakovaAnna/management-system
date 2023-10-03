import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from '@app/modules/navbar/navbar.component';
import {environment} from '@env/environment';
import {CoreModuleMock} from '@app/core.module.mock';
import {CoreModule} from '@app/core.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    environment.mock ? CoreModuleMock.forRoot() : CoreModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    NavbarComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
