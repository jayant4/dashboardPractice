import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-document-manager',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.css']
})
export class DocumentManagerComponent implements OnInit {

  constructor(public appService : AppService) { 
  }

  ngOnInit(): void {
  }

  @Input()
  public documents: any ;

  public clickedOnDocument(document : any)  {
    this.appService.appState.selectedDocument = document;
  }


}
