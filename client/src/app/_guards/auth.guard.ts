import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr:ToastrService) {}

  canActivate(): Observable<boolean>{ // if the user is set in the observable then it may return true else the route guard will not work
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true
        }else{
          this.toastr.error("You are not authorized in order to access this path!");
          return null;
        }
      })
    )
  }

}
