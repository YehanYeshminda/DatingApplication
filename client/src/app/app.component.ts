import { AccountService } from './_services/account.service';
import { User } from './_models/User';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Dating Application';

  baseUrl: string = 'https://localhost:5001/api/';

  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) {}

  ngOnInit() {
    this.getUsers();
    this.setCurrentUser(); // called when this component is called
  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem("user"));
    this.accountService.setCurrentUser(user);
  }

  // creating a simple get request
  getUsers() {
    this.http.get(this.baseUrl + 'users').subscribe({
      next: (res) => {
        this.users = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
