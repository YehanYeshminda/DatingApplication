import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { User } from './../../_models/User';
import { Member } from 'src/app/_models/Member';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  member: Member | undefined; // we go with undefined because we don't know this yet
  user: User | null = null; // contains username and token
  @ViewChild('editForm') editForm: NgForm | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastrService: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;

    this.memberService.getMember(this.user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember(){
    console.log(this.member)
    this.toastrService.success("Porfile has been edited successylly", "Update Successful!")
    this.editForm?.reset(this.member); // this is used to rest and remove the dirty from the html
  }
}
