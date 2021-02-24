import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'folder-manager',
  templateUrl: './folder-manager.component.html',
  styleUrls: ['./folder-manager.component.css']
})
export class FolderManagerComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }


  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;


  @ViewChild('inputField') 
  set inputField(element : ElementRef<HTMLInputElement>){
    if(element){
      element.nativeElement.focus();
    }
  }



  @Input()
  public document: any;

  public clickedOnDocument() {
    this.appService.appState.selectedDocument = this.document;
    this.document.isSelected = true;

    console.log(this.document);

    this.trigger.closeMenu();

  }

  public saveFolder(event: any) {
    if (event.keyCode === 13) {
      this.document.isEditing = false;
    }
  }


  public folderDeSelected() {
    this.document.isSelected = false;

  }

  public onRightClick() {
    this.trigger.openMenu();
    return false;
  }

  public deleteFolder() {
    this.document.isDeleted = true;

  }
  public renameFolder() {
    this.document.isEditing = true;
  }

  public toggleFolderVisibility(){
    if(this.document.isExpanded === true){
      this.document.isExpanded = false;
    } else{
      this.document.isExpanded = true;
    }
  }

}
