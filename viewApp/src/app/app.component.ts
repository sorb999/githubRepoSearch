import { Component } from '@angular/core';
import { httpService } from './service/httpService';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, from} from 'rxjs'
import {switchMap, debounceTime} from 'rxjs/operators';
import {environment} from './../environments/environment'
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'viewApp';
  repoForm: FormGroup;
  filteredUsers: Observable<any>;
  gitHubUrl:string = environment.githubUrl;
  showTopPackages:boolean = false;
  topPackagesList = [];
  


  constructor(private snackBar: MatSnackBar,private fb: FormBuilder,private httpSrv: httpService) { }

  ngOnInit() {
    this.repoForm = this.fb.group({
      userInput: null
    })

    this.filteredUsers = this.repoForm.get('userInput').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.httpSrv.search({name: value}, 1))
      );

      this.getAllRepoList();
  }

  getAllRepoList(){
    
    this.httpSrv.getAllRepoList().subscribe( res => {
      this.httpSrv.repoList = JSON.parse(res);
    })
  }
  
  showSnackbar(message, action){
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  displayFn(user) {
    if (user) { return user.name; }
  }

  onImportClick(repo){
    debugger

    let repoUrl = this.gitHubUrl + "repos/" + repo.owner.login + "/" + repo.name + "/contents/package.json";
    this.httpSrv.getContentFromUrl(repoUrl).subscribe( res => {
      this.httpSrv.getContentFromUrl(res.download_url).subscribe( packageData => {
        this.httpSrv.saveDataToDB(repo.id, repo.name, packageData).subscribe( data => {
          if (repo.selected) {
            this.showSnackbar("Updated successfully ", "Close");
          } else{
            this.showSnackbar("Imported successfully ", "Close");
          }
          this.getAllRepoList();
        }, err => {
          // this.showSnackbar();
          this.showSnackbar("something went wrong while saving/importing ", "Close");
        });
      }, err => {
        this.showSnackbar("Repository does not have valid package.json file", "Close");
    });
    }, error => {
      this.showSnackbar("Repository does not have valid package.json file", "Close");
  });

  }

  getTopPackagesList(){
    this.showTopPackages=!this.showTopPackages;
    this.topPackagesList = [];
    this.httpSrv.getTopPackagesList().subscribe( res => {
      debugger
      this.topPackagesList = res;
    })
  }

}
