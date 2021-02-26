import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generate } from "short-uuid";

export enum DocumentType {
  FILE = "FILE",
  FOLDER = "FOLDER"
}

interface Document {
  id: string;
  type: string;
  name: string;
  content: string | null; // if file thhen it will have string content
  documents: Array<Document> | null; // if folder then it will have array of documents
  isEditing: boolean; // null when type is folder
  canBeEdited: boolean;
  status: string; // new_not_saved, new_saving, saved, changed, changed_saving
  isDeleted: boolean;
  // canHaveChildren : boolean;
  isExpanded: boolean; // by default expanded is false i.e folder is closed
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


  constructor(private _snackBar: MatSnackBar) {
    this.appState = {
      selectedDocument: null,
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

    const defaultRootFolder1 = {
      id: this._guid(),
      name: "Root",
      type: "FOLDER",
      documents: [],
      isDeleted: false,
      isEditing: false,
      isExpanded: false
    }

    // console.log(JSON.stringify(defaultRootFolder));


    const defaultRootFolder = {
      id: this._guid(),
      name: "Root",
      type: "FOLDER",
      documents: [
        {
          id: "",
          name: "h1",
          type: "FILE",
          documents: [],
          isDeleted: false,
          isEditing: false,
          isExpanded: false,
          content : "drcgbmkugytfdcfgbh",
          isSelected : false

        },
        {
          id: "",
          name: "h2",
          type: 'FOLDER',
          documents: [
            {
              id: "",
              name: "h3",
              type: "FOLDER",
              documents: [
                {
                  id: "",
                  name: "h4",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content : "bhcashdcbdsib uhwefui hcuiohew uuhweu hcuh uchwcu u"

                }
              ],
              isDeleted: false,
              isExpanded: false
            },
            {
              id: "",
              name: "h5",
              type: "FILE",
              documents: [],
              isDeleted: false,
              isExpanded: false,
              content : "bhcashdcbdsib uhwefui hcuiohew uuhweu hcuh uchwcu u sdvsdvsdv  g ass r sre bs s erse st s"

            }
          ],
          isDeleted: false,
          isExpanded: false

        },
        {
          id: "",
          name: "h6",
          type: "FILE",
          documents: [],
          isDeleted: false,
          isExpanded: false.valueOf,
          content : "bhcashdcbdsib uhwefui hcuiohew uuhweu hcuh uchwcu u sdvsdvsdv  g ass r sre bs s erse st ssdv bsr sbstg sgs fgsfgs g shbs "
        },
      ],
      isEditing: false,
      canBeEdited: false,
      content: null,
      isDeleted: false,
      isExpanded: false

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
    this.appState.dashboards.unshift(newDashboard);

    // select the new dashboard
    this.appState.selectedDashboard = newDashboard;

    return { status: "SUCCESS", reason: "" };

  }

  public selectedDashboard(dashboard: Dashboard) {
    this.appState.selectedDashboard = dashboard;
  }

  // ---------------------------------------------------------------------------------

  public createNewFile() {
        // to expand a collapsed folder if selected and trying to add a file
        this.appState.selectedDocument.isExpanded = false;

    if (this.appState.selectedDocument === null) {

      this.openSnackBar("Please Select a Folder.!", "OK");

    } else {

      if(this.appState.selectedDocument.type === 'FOLDER'){

        let index = this.appState.selectedDocument?.documents.findIndex((document:any) => document.status === 'NEW_NOT_SAVED' );
        if(index === -1){
          const newFile: Document = {
            id: generate(),
            content: "",
            name: "",
            type: 'FILE',
            isEditing: true,
            documents: null,
            canBeEdited: true,
            status: "NEW_NOT_SAVED",
            isDeleted: false, 
            isExpanded: false,
            isSelected: false
            
          };
          this.appState.selectedDocument?.documents.unshift(newFile);
        }else{

          this.openSnackBar("Please Select a Folder.!", "OK");
        }

      }else{
        this.openSnackBar("Please Select a Folder.!", "OK");
      }
    }
  }


  //  create folder
  public createNewFolder() {

    // to expand a collapsed folder if selected and trying to add a folder
    this.appState.selectedDocument.isExpanded = false;
    
    if (this.appState.selectedDocument === null) {
      

      this.openSnackBar("Please Select a Folder.!", "OK");

    } else {

      if(this.appState.selectedDocument.type === 'FOLDER'){


        const newFolder: Document = {
          id: generate(),
          content: "h",
          name: "",
          type: 'FOLDER',
          isEditing: true,
          documents: [],
          canBeEdited: true,
          status: "NEW_NOT_SAVED",
          isDeleted: false,
          isExpanded: false,
          isSelected: false
        };
        this.appState.selectedDocument?.documents.unshift(newFolder);

      }else{

        this.openSnackBar("Please Select a Folder.!", "OK");

      }

    }
  }

  public doesFolderNameExist(folderName: any){
    let index = this.appState.selectedDocument?.documents.findIndex((document:any) => document.name === folderName );
    if(index === -1){ // not found
      return false;
    }else{ // found
      return true;
    }
  }


  public deselectCurrentlySelected(): void {
    if (this.appState.selectedDocument !== null) {
      this.appState.selectedDocument.isSelected = false;
      this.appState.selectedDocument = null;
    }
  }

  public selectNew(document: any): void {
    if (document !== null) {
      this.appState.selectedDocument = document;
      this.appState.selectedDocument.isSelected = true;
    } else {
      throw "Document cannot be null";
    }
  }

  public saveDocument(document: any, name: string): void {
    if (document !== null) {

      document.name = name;
      document.status = "SAVED";
      document.isEditing = false;

      // select the newly selected document
      this.deselectCurrentlySelected();
      this.selectNew(document);

    } else {
      throw "Document cannot be null";
    }
  }

  public deleteEmptyDocument(document: any) {

    if (document !== null) {
      this.appState.selectedDocument.documents.splice(document,1);
    } else {
      throw "Document cannot be null";

    }
  }


  //  ui function
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }


}
