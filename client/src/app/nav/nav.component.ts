import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};

  // if we want to use the account service outside of the component then make it public
  constructor(public accountService: AccountService, public router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl("/members") // in order to navigate on login
      },
      error: (err) => console.log(err)
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/") // in order to navigate on logout
  }
}
