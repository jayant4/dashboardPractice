import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor(public appService : AppService) { }

  ngOnInit(): void {
  }

  @Input()
  public document : any; 
  saveFile(event:any){
    console.log(event);
    
    if(event.keyCode === 13){
      this.document.isEditing = false;
    }
  }

}
