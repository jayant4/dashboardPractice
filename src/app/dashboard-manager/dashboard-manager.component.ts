import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard-manager',
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css']
})
export class DashboardManagerComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

  public newDashboardName: string = "s1";

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

}
