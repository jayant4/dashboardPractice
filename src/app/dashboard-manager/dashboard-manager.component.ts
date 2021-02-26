import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard-manager',
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css']
})
export class DashboardManagerComponent implements OnInit {

  public tabs : any;
  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    this.tabs = this.appService.appState.filesOpenedInTabs;
  }




  public newDashboardName: string = "s1";

  public toggleTheme: boolean = true;

  public addNewDashboard() {
    const result = this.appService.createNewDashboard(this.newDashboardName);

    if (result.status === "VALIDATION_ERROR") {
      alert(result.reason);
    } else if (result.status === "DOMAIN_ERROR") {
      alert(result.reason);
    } else if (result.status === "SUCCCESS") {
      // TODO: 
    }
  }


  public newFile() {
    this.appService.createNewFile();
  }

  public newFolder() {

    this.appService.createNewFolder();

  }

  public getDocumentContain(){

    if(this.appService.appState.selectedDocument === null || this.appService.appState.selectedDocument.content === null){
      return 'function x() {\nconsole.log("Hello world!");\n}';
    }else{
      console.log(this.appService.appState.selectedDocument.content , "csd");
      
      return this.appService.appState.selectedDocument.content;
    }
  }

  //-------------------------------------------------------  for monaco editor -------------------------------------------------------
  public editorOptions = {theme: "vs-dark", language: 'javascript', colorDecoration : 14};

  public code : string = ' function x() {\nconsole.log("Hello world!");\n}';
  
 
  public onFileTabClick(doc:any){
    this.appService.showFileFromTabs(doc);
  }

  public deleteFileFromTabs(doc:any){ 
    this.appService.deleteFileFromTabs(doc);
  }
  
}
