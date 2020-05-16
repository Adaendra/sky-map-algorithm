import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AppAdaendraSkyViewerComponent} from "./components/app-adaendra-sky-viewer/app-adaendra-sky-viewer.component";

@NgModule({
  declarations: [
    AppComponent,
    AppAdaendraSkyViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
