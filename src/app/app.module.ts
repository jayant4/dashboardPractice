import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { FormsModule } from '@angular/forms';
import { DocumentManagerComponent } from './document-manager/document-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardManagerComponent,
    DocumentManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
