import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { FormsModule } from '@angular/forms';
import { DocumentManagerComponent } from './document-manager/document-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { FolderManagerComponent } from './folder-manager/folder-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardManagerComponent,
    DocumentManagerComponent,
    FileManagerComponent,
    FolderManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
