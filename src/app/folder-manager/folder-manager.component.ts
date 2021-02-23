import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'folder-manager',
  templateUrl: './folder-manager.component.html',
  styleUrls: ['./folder-manager.component.css']
})
export class FolderManagerComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }



  @Input()
  public documents: any;

  public clickedOnDocument(document: any) {
    this.appService.appState.selectedDocument = document;
  }

  public saveFolder(event: any) {
    if (event.keyCode === 13) {
      // this.document.isEditing = false;
    }
  }



}
