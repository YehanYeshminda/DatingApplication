import { Message } from './../../_models/Message';
import { MessagesService } from 'src/app/_services/messages.service';
import { MembersService } from './../../_services/members.service';
import { Member } from './../../_models/Member';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined; // can also be undefined
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;
  activeTab?: TabDirective;
  messages: Message[] = [];

  // when a user clicks on a route they will then click on the current route
  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  getImages() {
    if (!this.member) return [];

    const imageUrls = [];

    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }

    return imageUrls;
  }

  loadMember() {
    // getting the username from the parameters
    const username = this.route.snapshot.paramMap.get('username');

    if (!username) return; // will stop the execution of the method

    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
        this.galleryImages = this.getImages();
      },
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (message) => (this.messages = message),
      });
    }
  }

  selectTab(heading: string){
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }
}
