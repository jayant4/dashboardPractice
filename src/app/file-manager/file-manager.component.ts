import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppService } from '../app.service';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  public inputFieldRef: any;

  fileName = new FormControl('', Validators.compose([Validators.required]));

  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

  @Input()
  public document: any;


  saveFileOnKeyUp(event: any) {

    if (event.keyCode === 13 || event.keyCode === 27) {
      if (this.fileName.value.trim() === "") { // filename empty do not allow to save file
        this.appService.deleteEmptyDocument(this.document)
      } else {

        this.appService.saveDocument(this.document, this.fileName.value);

      }

    }
  }

  saveFileBlur() {
    if (this.fileName.value.trim() === "") { // filename empty do not allow to save file || this.fileName.value.length < 3
      this.appService.deleteEmptyDocument(this.document)

    } else {
      this.appService.saveDocument(this.document, this.fileName.value);
    }
  }

  @ViewChild('inputField')
  set inputField(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  public onRightClick() {
    this.trigger.openMenu();
    return false;
  }

  // to disable the menu on leftclick , just call    this.trigger.closeMenu() from the leftclick function
  public onLeftClick() {
    this.trigger.closeMenu();
    this.document.isSelected = true;

  }

  deleteFile() { // delete file meant to soft delete file from the datamodel
    this.document.isDeleted = true;
  }

  renameFile() {
    this.document.isEditing = true;
  }
}
