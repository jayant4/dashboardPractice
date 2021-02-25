import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentManagerComponent } from './document-manager/document-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { FolderManagerComponent } from './folder-manager/folder-manager.component';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    DashboardManagerComponent,
    DocumentManagerComponent,
    FileManagerComponent,
    FolderManagerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonModule
   

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
