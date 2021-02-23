import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { generate } from "short-uuid";

enum DocumentType {
  FILE,
  FOLDER
}

interface Document {
  id: string;
  type: DocumentType;
  name: string;
  content: string | null; // if file thhen it will have string content
  documents: Array<Document> | null; // if folder then it will have array of documents
  isEditing: boolean; // null when type is folder
  canBeEdited: boolean;
  isSelected: boolean;
}


interface Dashboard {
  id: string;
  name: string;
  status: string; // new_not_saved, new_saving, saved, changed, changed_saving
  selectedFolder: string | null; //  by default the root folder will be selected which is signified by null
  documents: Document[];
}

interface AppState {
  dashboards: any[];
  uiState: string;
  autoSave: boolean;
  selectedDashboard: any;
}

interface CreateNewDashboardReturnType {
  status: string;
  reason: string;
}

interface AddFileToDashboardReturnType {
  status: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public appState: any;


  constructor() {
    this.appState = {
      selectedDocument : null,
      dashboards: [],
      uiState: "",
      autoSave: false,
      selectedDashboard: null
    };
  }

  private _guid() {
    return generate(); // TODO: replace with actual code
  }

  // User Activities Functionality
  public createNewDashboard(name: string): CreateNewDashboardReturnType {

    // Validate all the parameters
    if (typeof name !== "string") // this conditions will get checked name === undefined || name === null
      return { status: "VALIDATION_ERROR", reason: "Name must of string type" };

    if (name?.trim() === "")
      return { status: "VALIDATION_ERROR", reason: "Name cannot be blank" };

    if (this.appState?.dashboards?.length > 0) {
      // if dashboard by the same is not found (then it return undefined), then allow to create new dashboard
      const dashboardExists = this.appState.dashboards.find((dashboard: any) => dashboard.name === name);

      if (dashboardExists)
        return { status: "DOMAIN_ERROR", reason: "Dashboard by this name already exists" };
    }

    const defaultRootFolder = {
      id: this._guid(),
      name: "Root",
      type: DocumentType.FOLDER,
      documents: [
        {
          id: "",
          name: "h1",
          documents: []
        },
        {
          id: "",
          name: "h2",
          documents: [
            {
              id: "",
              name: "h3",
              documents: []
            },
            {
              id: "",
              name: "h4",
              documents: []
            }
          ]
        }
      ],
      isEditing: false,
      canBeEdited: false,
      content: null,
      isSelected: false
    };

    // create new dashboard
    const newDashboard = {
      id: this._guid(),
      name,
      status: "new_not_saved",
      selectedFolder: "",
      documents: [
        defaultRootFolder,
      ],
    };

    // add new dashboard to array of dashboards
    this.appState.dashboards.push(newDashboard);

    // select the new dashboard
    this.appState.selectedDashboard = newDashboard;

    return { status: "SUCCESS", reason: "" };

  }

  public selectedDashboard(dashboard: Dashboard) {
    this.appState.selectedDashboard = dashboard;
  }

  // ---------------------------------------------------------------------------------

  public createNewFile() {

    const newFile: Document = {
      id: generate(),
      content: "",
      name: "",
      type: DocumentType.FILE,
      isEditing: true,
      documents: null,
      canBeEdited: true,
      isSelected: false
    };

    this.appState.selectedDocument?.documents.push(newFile);
  }

  public addFileToDashboard(fileName: string): AddFileToDashboardReturnType {

    // Validate all the parameters
    if (typeof fileName !== "string") // this conditions will get checked fileName === undefined || fileName === null
      return { status: "VALIDATION_ERROR", reason: "FileName must of string type" };

    if (fileName?.trim() === "")
      return { status: "VALIDATION_ERROR", reason: "FileName cannot be blank" };

    if (this.appState.selectedDashboard) {
      return { status: "DOMAIN_ERROR", reason: "No Dashboard is selected" };
    }

    // it it is null or undefined 
    if (!this.appState.selectedDashboard) {
      return { status: "DOMAIN_ERROR", reason: "No Dashboard is selected" };
    }

    const newFile: Document = {
      id: generate(),
      content: "dafadfasdfsafsdaf",
      name: "file1.txt",
      type: DocumentType.FILE,
      isEditing: false,
      documents: null,
      canBeEdited: true,
      isSelected: false
    };

    this.appState.selectedDashboard?.documents.push(newFile);

    return { status: "SUCCESS", reason: "" };

  }





}
