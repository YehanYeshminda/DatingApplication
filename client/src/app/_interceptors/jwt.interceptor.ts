import { User } from './../_models/User';
import { AccountService } from './../_services/account.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  // ng g interceptor jwt --skip-tests
  constructor(private accountService : AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser:User;

    //  we will complete once we receive a user with the token and the user information
    this.accountService.currentUser$.pipe(take(1)).subscribe({
       next: res => currentUser = res
    });

    // will attach the token for evety request when we are logged in
    if(currentUser){
      request = request.clone({
        setHeaders:{
          Authorization : `Bearer ${currentUser.token}`
        }
      })
    }

    return next.handle(request);
  }
}
