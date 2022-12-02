import { PaginatedResults } from './../_models/Pagination';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Member } from '../_models/Member';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResults: PaginatedResults<Member[]> = new PaginatedResults<Member[]>();

  constructor(private http: HttpClient) {}

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams(); // allows to set params in the url

    if(page && itemsPerPage){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        if (response.body) {
          this.paginatedResults.result = response.body;
        }

        // this will be the header which we will get
        const pagination = response.headers.get("Pagination");

        if (pagination){
          this.paginatedResults.pagination = JSON.parse(pagination);
        }

        return this.paginatedResults;
      })
    );

    // return without pagination
    // if (this.members.length > 0) return of(this.members); // this returns a observable
    // return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      // map((members) => {
      //   this.members = members;
      //   return members;
      // })
    // );
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username); // used for caching

    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  setMainPhoto(photoId: number){
      return this.http.put(this.baseUrl + "users/set-main-photo/" + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId);
  }
}
