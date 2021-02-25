import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'folder-manager',
  templateUrl: './folder-manager.component.html',
  styleUrls: ['./folder-manager.component.css']
})
export class FolderManagerComponent implements OnInit {

  constructor(public appService: AppService) {

  }

  ngOnInit(): void {

  }


  folderName = new FormControl('', Validators.compose([Validators.required]));


  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;


  // To bring focus in the textbox
  @ViewChild('inputField')
  set inputField(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  @Input()
  public document: any;

  public clickedOnDocument() {
    this.appService.deselectCurrentlySelected();
    this.appService.selectNew(this.document);
    this.trigger.closeMenu();
  }


  // Ths is required to handle Enter Key and Save the folder
  public saveFolderOnKeyUp(event: any) {

    if (event.keyCode === 13 || event.keyCode === 27) {
      if (this.folderName.value.trim() === "") {
        this.appService.deleteEmptyDocument(this.document);
      }else{
        this.appService.saveDocument(this.document, this.folderName.value);
      }
    }

  }

  // Ths is required to save the folder when user hits tab to loose the focus or user clicks oustise to loose the focus
  saveFolderOnBlur() {
    if (this.folderName.value.trim() === "") { // filename empty do not allow to save file || this.folderName.value.length < 3
      this.appService.deleteEmptyDocument(this.document)

    } else {
      this.appService.saveDocument(this.document, this.folderName.value);
    }
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

  public toggleFolderVisibility() {
    if (this.document.isExpanded === true) {
      this.document.isExpanded = false;
    } else {
      this.document.isExpanded = true;
    }
  }

}