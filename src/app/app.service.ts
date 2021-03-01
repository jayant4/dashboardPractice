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
      fileTabs: [],
      dashboards: [],
      uiState: "",
      autoSave: false,
      selectedDashboard: null,
      lastFileDocumentSelectedInTab: null,
    };
  }

  private _guid() {
    return generate(); 
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
          id: "1",
          name: "h1.js",
          type: "FILE",
          documents: [],
          isDeleted: false,
          isEditing: false,
          isExpanded: false,
          content: "f1",
          isSelected: false

        },
        {
          id: "2",
          name: "h2",
          type: 'FOLDER',
          documents: [
            {
              id: "3",
              name: "h3",
              type: "FOLDER",
              documents: [
                {
                  id: "4",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "48",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "49",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "41",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "42",
                  name: "h4.py",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "43",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                },
                {
                  id: "44",
                  name: "h4.js",
                  type: "FILE",
                  documents: [],
                  isDeleted: false,
                  isExpanded: false,
                  content: "f4"

                }
              ],
              isDeleted: false,
              isExpanded: false,
              content: null
            },
            {
              id: "5",
              name: "h5.py",
              type: "FILE",
              documents: [],
              isDeleted: false,
              isExpanded: false,
              content: "f5"

            }
          ],
          isDeleted: false,
          isExpanded: false,
          content: null


        },
        {
          id: "6",
          name: "h6.ts",
          type: "FILE",
          documents: [],
          isDeleted: false,
          isExpanded: false,
          content: "f6"
        },
      ],
      isEditing: false,
      canBeEdited: false,
      content: null,
      isDeleted: false,
      isExpanded: false,



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

      if (this.appState.selectedDocument.type === 'FOLDER') {

        let index = this.appState.selectedDocument?.documents.findIndex((document: any) => document.status === 'NEW_NOT_SAVED');
        if (index === -1) {
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
        } else {

          this.openSnackBar("Please Select a Folder.!", "OK");
        }

      } else {
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

      if (this.appState.selectedDocument.type === 'FOLDER') {


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

      } else {

        this.openSnackBar("Please Select a Folder.!", "OK");

      }

    }
  }

  public doesFolderNameExist(folderName: any) {
    let index = this.appState.selectedDocument?.documents.findIndex((document: any) => document.name === folderName);
    if (index === -1) { // not found
      return false;
    } else { // found
      return true;
    }
  }


  public deselectCurrentlySelected(): void {

    if (this.appState.selectedDocument !== null) {

      // remember the last index of file
      if (this.appState.selectedDocument.type === 'FILE') {
        let index = this.findIndexOfLastSelectedFile(this.appState.fileTabs);
        // add this index to the file
        console.log(index);

        this.appState.indexOfLastOpenedFile = index;
      }
      this.appState.selectedDocument.isSelected = false;
      this.appState.selectedDocument = null;
    }
  }


  public findIndexOfLastSelectedFile(tabArray: any) {
    return tabArray.findIndex((file: any) => file.isSelected === true);


  }

  public selectNew(document: any): void {
    if (document !== null) {
      if (document.type === 'FOLDER') {

        this.appState.selectedDocument = document;
        this.appState.selectedDocument.isSelected = true;
      } else if (document.type === 'FILE') {
        this.appState.selectedDocument = document;
        this.appState.selectedDocument.isSelected = true;
        this.appState.lastFileDocumentSelectedInTab = document;
      }
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
      this.appState.selectedDocument.documents.splice(document, 1);
    } else {
      throw "Document cannot be null";
    }
  }

  public addFileToTabs(document: any) {
    let index = this.appState.fileTabs.findIndex((doc: any) => doc.id === document.id);
    if (index === -1) {
      this.appState.fileTabs.push(document);
    }
  }

  public deleteFileFromTabs(document: any) {

    let indexOfFileToDeleted = this.appState.fileTabs.findIndex((doc: any) => doc.id === document.id);

    console.log(indexOfFileToDeleted,"del");
    

    let indexOfNextFileToBeSelected: number | null = null;


    // //if its a last file and there are only 2 files
    // if (this.appState.fileTabs.length - 1 === indexOfNextFileToBeSelected && this.appState.fileTabs.length === 2) {
    //   // selecting the left file
    //   indexOfNextFileToBeSelected = indexOfFileToDeleted - 1;
    // } else if (this.appState.fileTabs.length - 1 === indexOfNextFileToBeSelected && this.appState.fileTabs.length === 1) { // there is only 1 file left and its the last file

    //   // no files as selected and 
    //   indexOfNextFileToBeSelected = -1

    // }
    // else if (this.appState.fileTabs.length - 1 === indexOfNextFileToBeSelected && this.appState.fileTabs.length > 2) { // there is only 1 file left and its the last file

    //   // to show the last file
    //   indexOfNextFileToBeSelected = this.appState.fileTabs.length - 1

    // }

    // # TODO DELETE AND SHO A FILE FROM TABS

    if (indexOfFileToDeleted < this.appState.fileTabs.length) { // files are present on the right side of the file to be deleted , ASSIGN RIGHT FILE
      indexOfNextFileToBeSelected = indexOfFileToDeleted + 1

    } else if (indexOfFileToDeleted === this.appState.fileTabs.length) { // last file is deleted , there are no files on the right side

      if (this.appState.fileTabs.length === 1) {  // this is the last file to be deleted , assign null

        indexOfNextFileToBeSelected = null

      }

      indexOfNextFileToBeSelected = indexOfFileToDeleted - 1;




    }


    if (this.appState.fileTabs.length > indexOfFileToDeleted + 1) {
      indexOfNextFileToBeSelected = this.appState.fileTabs[indexOfFileToDeleted];
      console.log(indexOfNextFileToBeSelected);




    } else {
      if (this.appState.fileTabs.length === 0) {

        this.appState.lastFileDocumentSelectedInTab = null;

      } else {

        indexOfNextFileToBeSelected = this.appState.fileTabs[indexOfFileToDeleted - 1];
        console.log(indexOfNextFileToBeSelected);


      }
    }


    this.appState.fileTabs.splice(indexOfFileToDeleted, 1);
    this.deselectCurrentlySelected();

    this.showFileFromTabs(indexOfNextFileToBeSelected);


    // this.showFileFromTabs(this.appState.fileTabs.length != 0 ? this.appState.fileTabs[0] : null);
    // this.showFileFromTabs(this.appState.fileTabs.length != 0 ? this.appState.fileTabs.length > 1 : null);

  }

  public showFileFromTabs(document: any) {

    if (document.type === "FILE") {
      this.deselectCurrentlySelected();
      this.selectNew(document);
    }

  }


  //  ui function
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }


}
