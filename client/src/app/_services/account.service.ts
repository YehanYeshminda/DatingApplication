import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<User>(1); // this is used to store a value inside of this and how much values we are storing inside
  currentUser$ = this.currentUserSource.asObservable(); // getting the user inside of a observable

  constructor(private http: HttpClient) {}

  // in order to login the user
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((res: User) => {
        const user = res; // the responsce is the user

        // if we have a user
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model:any){
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      // the below is used to set the user in the localstorage
      map((user:User) => {
        if (user){
          localStorage.setItem("user", JSON.stringify(user));
          this.currentUserSource.next(user);
        }

        // return user;         // we could return user from the register if we wanted to
      })
    )
  }

  // method used to set the current user
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null); // removing the user
  }
}
