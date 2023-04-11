import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/users';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((res) => {
        const user = res;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    // setting roles
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles ? (user.roles = roles) : user.roles.push(roles));

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);

    // signalR checking and starting the connection if there is a user
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

    // signalR stopping the connection
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
