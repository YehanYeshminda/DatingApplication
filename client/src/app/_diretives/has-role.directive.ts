import { AccountService } from './../_services/account.service';
import { User } from 'src/app/_models/User';
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appHasRole]', // *appHasRole='["Admin"]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  ngOnInit(): void {
    if (this.user.roles.some((r) => this.appHasRole.includes(r))) { // checking if the roles which we are checking does include inside this
      this.viewContainerRef.createEmbeddedView(this.templateRef); // then we display the content
    } else {
      this.viewContainerRef.clear(); // else we don't show the content
    }
  }
}
