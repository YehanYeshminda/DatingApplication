import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { Member } from './../../_models/Member';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() memberInformation: Member;

  constructor(private memberService: MembersService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  AddLike(member : Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success("You have liked " + member.knownAs),
    })
  }
}
