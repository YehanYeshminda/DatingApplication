import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  // the below methods are used to pass in options manually
  // getMembers() {
  //   return this.http.get<Member[]>(
  //     this.baseUrl + 'users',
  //     this.getHttpOptions()
  //   );
  // }

  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return; // if no user string

  //   const user = JSON.parse(userString);

  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token,
  //     }),
  //   };
  // }
}
