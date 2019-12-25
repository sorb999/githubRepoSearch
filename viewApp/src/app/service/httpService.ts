import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {map, tap} from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class httpService {

  constructor(private http: HttpClient) { }
   apiURL = environment.baseUrl;
   gitHubUrl = environment.githubUrl;
   repoList = [];

  search(q,aa): Observable<any> {
    debugger
    return this.http.get<any>(this.gitHubUrl + "search/repositories?q=" + q.name +"&sort=stars&order=desc")
    .pipe(
      tap((response: any) => {
        for (let i = 0; i < response.items.length; i++) {
          response.items[i].selected = false;
          for (let j = 0; j < this.repoList.length; j++) {
            if (this.repoList[j].repoId == response.items[i].id ) {
              response.items[i].selected = true;
              break;
            }
          }
        }
        response.results = response.items;
        return response;
      })
      );
  }

  getContentFromUrl(repoUrl): Observable<any> {
    return this.http.get(repoUrl, {responseType: 'json'});
  }

  getAllRepoList(): Observable<any> {
    return this.http.post(this.apiURL + '/getAllRepoList',{}, {responseType: 'text'});
  }
  
  saveDataToDB(id, name, packageData): Observable<any> {
    let devDependenciesList = [];
    for (var key in packageData.devDependencies) {
      if (packageData.devDependencies.hasOwnProperty(key)) {
        devDependenciesList.push(key);
      }
    }
    return this.http.post(this.apiURL + '/saveContents',{id, name, devDependenciesList}, {responseType: 'text'});
  }

  getTopPackagesList(): Observable<any> {
    return this.http.post(this.apiURL + '/getTopPackagesList', {responseType: 'json'});
  }

}