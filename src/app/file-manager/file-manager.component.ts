import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppService } from '../app.service';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

  @Input()
  public document: any;

  saveFile(event: any) {
    console.log(event);

    if (event.keyCode === 13) {
      this.document.isEditing = false;
    }
  }


  @ViewChild(MatMenuTrigger)
  trigger!: MatMenuTrigger;

  // @ViewChild('rightMenuTrigger')
  // trigger! : MatMenuTrigger;

  public onRightClick() {
    this.trigger.openMenu();
    return false;
  }
  
  // to disable the menu on leftclick , just call    this.trigger.closeMenu() from the leftclick function

  public onLeftClick(){
    this.trigger.closeMenu();

  }


  deleteFile(){ // delete file meant to soft delete file from the datamodel

    this.document.isDeleted = true;

  }

  renameFile(){

    this.document.isEditing = true;
    console.log(this.document.isEditing);
    


  }






}
