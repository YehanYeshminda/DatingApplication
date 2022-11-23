import { Photo } from './../../_models/Photo';
import { MembersService } from './../../_services/members.service';
import { Member } from './../../_models/Member';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined; // can also be undefined
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  // when a user clicks on a route they will then click on the current route
  constructor(private memberService:MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent : 100,
        thumbnailsColumns: 4,
        imageAnimation : NgxGalleryAnimation.Slide,
        preview: false,
      }
    ]
  }

  getImages() {
    if(!this.member) return [];

    const imageUrls = []

    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }

    return imageUrls;
  }

  loadMember(){
    // getting the username from the parameters
    const username = this.route.snapshot.paramMap.get('username')

    if(!username) return; // will stop the execution of the method

    this.memberService.getMember(username).subscribe({
      next : (member) => {
        this.member = member;
        this.galleryImages = this.getImages();
      }
    });
  }

}
