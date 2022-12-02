import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { UserParams } from './../../_models/UserParams';
import { Pagination } from './../../_models/Pagination';
import { MembersService } from './../../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/Member';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Female' },
  ];

  constructor(
    private memberService: MembersService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }

  loadMembers() {
    if (!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
      next: (res) => {
        if (res.result && res.pagination) {
          this.members = res.result;
          this.pagination = res.pagination;
        }
      },
    });
  }

  resetFilters(){
    if (this.user) {
      this.userParams = new UserParams(this.user);
      this.loadMembers();
    }
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
