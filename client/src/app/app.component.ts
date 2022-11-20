import { AccountService } from './_services/account.service';
import { User } from './_models/User';
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

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser(); // called when this component is called
  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem("user"));
    this.accountService.setCurrentUser(user);
  }
}
